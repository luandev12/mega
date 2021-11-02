import { fabric } from 'fabric';
import * as _ from 'underscore';
import TextBox from './TextBox';

import {
  fillTextCustom,
  getFontFamilyCustom,
  getFontSizeCustom,
  measureTextCustom,
} from '../utils/textUtil';

const OpentypeIText = fabric.util.createClass(fabric.IText, {
  type: 'opentype-itext',
  width: 1,
  totalWidthNoJustify: 1,
  height: 1,
  justifyWidth: 1,
  tracking: 0,
  lineSpacing: 1,
  ligatures: false,
  _ligaturesNotSupported: false,
  charsHeightCache: {},
  flatCharHeightCache: {},
  lineHeight: 1.16,
  _fontSizeMult: 1,
  _fontSizeFraction: 0,
  _methodsOverridden: false,
  _fillPatternNeedsUpdate: true,
  _lastDrawnData: {},
  opentypeStrokeWidth: 0,
  opentypeStroke: '#000000',
  strokeRenderingCanvas: null,
  CACHE_FONT_SIZE: 200,
  initialize: function(value: string, options: any) {
    options.objectCaching = true;
    this.justifyWidth = this.width;
    options.version = options.version || TextBox.prototype.version;
    this.strokeRenderingCanvas = fabric.util.createCanvasElement();

    this.getMeasuringContext().strokeRenderingCanvas = this.strokeRenderingCanvas;

    this.callSuper('initialize', value, options);
  },
  getMeasuringContext: function() {
    return (
      this._measuringContext ||
        (this._measuringContext =
          (this.canvas && this.canvas.contextCache) ||
          fabric.util.createCanvasElement().getContext('2d')),
      (this._measuringContext.opentypeStrokeWidth = this.opentypeStrokeWidth),
      (this._measuringContext.opentypeStroke = this.opentypeStroke),
      (this._measuringContext.lineSpacing = this.lineSpacing),
      this._measuringContext
    );
  },
  _getCacheCanvasDimensions: function() {
    var dim = this.callSuper('_getCacheCanvasDimensions');
    return (
      (dim.width += this.justifyWidth * dim.zoomX), (dim.height += this.height * dim.zoomY), dim
    );
  },
  _set: function(property: any, value: any) {
    var width;
    if ('textAlign' === property) {
      width = this.width;
    }
    this.callSuper('_set', property, value);
    if ('textAlign' === property) {
      this.set('width', width);
    } else {
      if ('fontFamily' === property) {
        this.charsHeightCache = {};
        this.flatCharHeightCache = {};
        this._ligaturesNotSupported = false;
      } else {
        if ('fillPattern' === property) {
          this._fillPatternNeedsUpdate = true;
        }
      }
    }
  },
  _render: function(ctx: any) {
    var options = this;
    ctx.strokeRenderingCanvas = this.strokeRenderingCanvas;
    if (this._fillPatternNeedsUpdate && this.fillPattern && !this._cacheContext._fillPattern) {
      this._fillPatternNeedsUpdate = false;
      this._cacheContext._fillPatternImage = this.fillPattern;
      this._cacheContext._fillPattern = this._cacheContext.createPattern(
        this.fillPattern.source,
        this.fillPattern.repeat || 'repeat',
      );
      console.warn('Pattern was null, recreating');
      var n = 0;
      var chat_retry = setInterval(function() {
        this._cacheContext._fillPattern = this._cacheContext.createPattern(
          this.fillPattern.source,
          this.fillPattern.repeat || 'repeat',
        );
        if (this._cacheContext._fillPattern) {
          clearInterval(chat_retry);
        } else {
          if (++n > 10) {
            clearInterval(chat_retry);
            console.error('Failed to create pattern');
          }
        }
      }, 50);
    }
    if (!this._methodsOverridden && this.objectCaching) {
      this._cacheContext._fillText = this._cacheContext._fillText || this._cacheContext.fillText;
      this._measuringContext._fillText =
        this._measuringContext._fillText || this._measuringContext.fillText;
      this._cacheContext.fillText = this._measuringContext.fillText = function(
        text: string,
        x: number,
        y: number,
      ) {
        return fillTextCustom.call(
          this,
          text,
          x,
          y,
          'justify' == options.textAlign ? options.justifyWidth : null,
          options.tracking,
        );
      };
      this._cacheContext.getFontSize = this._measuringContext.getFontSize = function() {
        return getFontSizeCustom.call(this);
      };
      this._cacheContext.getFontFamily = this._measuringContext.getFontFamily = function() {
        return getFontFamilyCustom.call(this);
      };
      this._cacheContext._measureText =
        this._cacheContext._measureText || this._cacheContext.measureText;
      this._measuringContext._measureText =
        this._measuringContext._measureText || this._measuringContext.measureText;
      this._cacheContext.measureText = this._measuringContext.measureText = function(text: string) {
        return measureTextCustom.call(this, text, true, null, options.tracking);
      };
      this._methodsOverridden = true;
    }
    this.callSuper('_render', ctx);
  },
  getHeightOfChar: function(i: any, c: any) {
    var ctx = this.getMeasuringContext();
    if (this._textLines[i][c]) {
      var _rl = this.getValueOfPropertyAt(i, c, 'fontSize') / this.CACHE_FONT_SIZE;
      var r = 0;
      if (this.charsHeightCache[this._textLines[i][c]]) {
        r = this.charsHeightCache[this._textLines[i][c]];
      } else {
        var message = measureTextCustom.call(ctx, this._textLines[i][c], true, null, this.tracking);
        this.charsHeightCache[this._textLines[i][c]] = message.heightNoStroke;
        r = message.heightNoStroke;
      }
      return (
        (r + (this.opentypeStrokeWidth || 0)) * _rl || this.getValueOfPropertyAt(i, c, 'fontSize')
      );
    }
    return this.getValueOfPropertyAt(i, c, 'fontSize');
  },
  getTextWidth: function(str: any) {
    var width = 0;
    var i = 0;
    for (; i < this._textLines.length; ++i) {
      var options = measureTextCustom.call(
        str,
        this._textLines[i].join(''),
        true,
        'justify' == this.textAlign ? this.justifyWidth : null,
        this.tracking,
      );
      width = Math.max(width, options.totalWidth || options.width);
    }
    return width;
  },
  getFlatCharacterHeight: function() {
    var params = this.getMeasuringContext();
    var es = this.fontSize / this.CACHE_FONT_SIZE;
    var t = 0;
    if (
      this.flatCharHeightCache.x &&
      this.flatCharHeightCache.x.font === params.font &&
      this.flatCharHeightCache.x.strokeWidth === params.opentypeStrokeWidth &&
      this.textAlign === this.flatCharHeightCache.x.textAlign
    ) {
      t = this.flatCharHeightCache.x.height;
    } else {
      var p = measureTextCustom.call(params, 'x', true, null, this.tracking);
      this.flatCharHeightCache.x = {};
      this.flatCharHeightCache.x.font = params.font;
      this.flatCharHeightCache.x.strokeWidth = params.opentypeStrokeWidth;
      this.flatCharHeightCache.x.textAlign = this.textAlign;
      this.flatCharHeightCache.x.height = p.heightNoStroke;
      t = p.heightNoStroke;
    }
    return (t = t * es);
  },
  _offsetY: 0,
  _renderTextCommon: function(ctx: any, method: any) {
    ctx.save();
    try {
      var options;
      var textWidth;
      this._lastDrawnData = {};
      ctx.opentypeStroke = this.opentypeStroke;
      ctx.opentypeStrokeWidth = this.opentypeStrokeWidth;
      ctx.lineSpacing = this.lineSpacing;
      ctx.ligatures = !this._ligaturesNotSupported && this.ligatures;
      textWidth =
        1 === this._textLines.length && 'justify' !== this.textAlign
          ? (options = measureTextCustom.call(
              ctx,
              this._textLines[0].join(''),
              true,
              null,
              this.tracking,
            )).totalWidth
          : this.getTextWidth(ctx);
      var indentString = 0;
      var left = -textWidth / 2;
      var a = [];
      var keys = [];
      var i = 0;
      var len = this._textLines.length;
      for (; i < len; i++) {
        var on;
        var delta = 0;
        if (!(1 === this._textLines.length && 'justify' !== this.textAlign)) {
          options = measureTextCustom.call(
            ctx,
            this._textLines[i].join(''),
            true,
            null,
            this.tracking,
          );
        }
        if ('center' === this.textAlign) {
          delta = (textWidth - options.totalWidth) / 2;
        }
        if ('right' === this.textAlign) {
          delta = textWidth - options.totalWidth;
        }
        delta = delta + options.leftStrokeWidth;
        on = options.fontHeight;
        keys[i] = on;
        if (i > 0) {
          indentString = indentString + keys[i - 1];
        }
        var request = this._renderTextLine(
          method,
          ctx,
          this._textLines[i],
          left + delta,
          indentString + this._offsetY - this.opentypeStrokeWidth / 2,
          i,
          options,
        );
        if (request) {
          a.push(request);
        }
      }
      if (a.length && a[0]) {
        var totalWidth = _.max(a, function(options) {
          return options.totalWidth;
        }).totalWidth;
        var callback = _.max(a, function(canCreateDiscussions) {
          return canCreateDiscussions.totalWidthNoJustify;
        }).totalWidthNoJustify;
        var zeroSizeMax = _.reduce(
          keys,
          function(buckets, name) {
            return buckets + name;
          },
          0,
        );
        var pixelSizeTargetMax = a[0].maxY + keys[0] * (a.length - 1);
        if (1 === a.length) {
          pixelSizeTargetMax = this.getFlatCharacterHeight();
        }
        var y = zeroSizeMax / 2 - (zeroSizeMax - pixelSizeTargetMax) / 2 - keys[0] * (a.length - 1);
        this.set('_offsetY', y);
        this.set('width', ('justify' === this.textAlign ? this.justifyWidth : totalWidth) || 1);
        this.set('totalWidthNoJustify', callback || 1);
        this.set('height', zeroSizeMax || 1);
      }
    } catch (b) {
      // if (!(!this._ligaturesNotSupported && b && b?.message.indexOf('is not yet supported') > -1)) {
      //   ctx.restore();
      //   throw b;
      // }
      this._ligaturesNotSupported = true;
      console.warn('Disabling ligatures for font ' + this.fontFamily);
    }
    ctx.restore();
  },
  _renderTextLine: function(
    method: any,
    ctx: any,
    line: any,
    left: any,
    top: any,
    lineIndex: any,
    style: any,
  ) {
    return this._renderChars(method, ctx, line, left, top, lineIndex, style);
  },
  _renderChars: function(
    method: any,
    ctx: any,
    line: any,
    left: any,
    top: any,
    lineIndex: any,
    options: any,
  ) {
    var actualStyle;
    var nextStyle;
    var charBox;
    var timeToRender;
    var value;
    var lineHeight = this.getHeightOfLine(lineIndex);
    var charsToRender = '';
    var boxWidth = 0;
    ctx.save();
    top = top - (lineHeight * this._fontSizeFraction) / this.lineHeight;
    var i = 0;
    var len = line.length - 1;
    for (; i <= len; i++) {
      timeToRender = i === len || this.charSpacing;
      charsToRender = charsToRender + line[i];
      charBox = this.__charBounds[lineIndex][i];
      if (0 === boxWidth) {
        left = left + (charBox.kernedWidth - charBox.width);
        left = left - options.leftSideBearing;
      }
      boxWidth = boxWidth + charBox.kernedWidth;
      if (!timeToRender) {
        actualStyle = actualStyle || this.getCompleteStyleDeclaration(lineIndex, i);
        nextStyle = this.getCompleteStyleDeclaration(lineIndex, i + 1);
        timeToRender = this._hasStyleChanged(actualStyle, nextStyle);
      }
      if (timeToRender) {
        value = this._renderChar(method, ctx, lineIndex, i, charsToRender, left, top, options);
        charsToRender = '';
        actualStyle = nextStyle;
        left = left + boxWidth;
        boxWidth = 0;
      }
    }
    ctx.restore();
    return value || options;
  },
  _renderChar: function(
    method: any,
    ctx: any,
    lineIndex: any,
    charIndex: any,
    _char: any,
    left: any,
    top: any,
    value: any,
  ) {
    var options;
    var decl = this._getStyleDeclaration(lineIndex, charIndex);
    var fullDecl = this.getCompleteStyleDeclaration(lineIndex, charIndex);
    var shouldFill = 'fillText' === method && fullDecl.fill;
    var shouldStroke = 'strokeText' === method && fullDecl.stroke && fullDecl.strokeWidth;
    if (!shouldStroke && !shouldFill) {
      return;
    }

    ctx.save();

    this._applyCharStyles(method, ctx, lineIndex, charIndex, fullDecl);

    if (decl && decl.textBackgroundColor) {
      this._removeShadow(ctx);
    }

    if (shouldFill) {
      ctx.lineMetrics = value;
      options = ctx.fillText(_char, left, top);
      this._lastDrawnData[lineIndex] = Object.assign({}, ctx.lastDrawnData, {
        width: this.width,
        height: this.height,
      });
      ctx.lineMetrics = null;
    }

    if (shouldStroke) {
      // ctx.strokeText(_char, left, top);
    }
    ctx.restore();
    return options;
  },
  _setTextStyles: function(ctx: any, charStyle: any, forMeasuring: any) {
    ctx.textBaseline = 'alphabetic';
    ctx.font = this._getFontDeclaration(charStyle, forMeasuring);
    ctx.trueFontSize = forMeasuring ? this.CACHE_FONT_SIZE : (charStyle || this).fontSize;
  },
  _applyCharStyles: function(
    method: any,
    ctx: any,
    lineIndex: any,
    charIndex: any,
    styleDeclaration: any,
  ) {
    this._setFillStyles(ctx, styleDeclaration);
    this._setStrokeStyles(ctx, styleDeclaration);
    ctx.font = this._getFontDeclaration(styleDeclaration);
    ctx.trueFontSize = (styleDeclaration || this).fontSize;
  },
  _measureChar: function(_char: any, charStyle: any, previousChar: any, prevCharStyle: any) {
    var width;
    var coupleWidth;
    var previousWidth;
    var kernedWidth;
    var fontCache = this.getFontCache(charStyle);
    var couple = previousChar + _char;
    var stylesAreEqual =
      this._getFontDeclaration(charStyle) === this._getFontDeclaration(prevCharStyle);
    var fontMultiplier = charStyle.fontSize / this.CACHE_FONT_SIZE;
    var size = charStyle.fontSize;
    if (
      (previousChar && fontCache[previousChar] && (previousWidth = fontCache[previousChar]),
      fontCache[_char] && (kernedWidth = width = fontCache[_char]),
      stylesAreEqual &&
        fontCache[couple] &&
        (kernedWidth = (coupleWidth = fontCache[couple]) - previousWidth),
      !width || !previousWidth || !coupleWidth)
    ) {
      var ctx = this.getMeasuringContext();
      this._setTextStyles(ctx, charStyle, true);
    }
    if (!width) {
      var config = measureTextCustom.call(ctx, _char, true, null, this.tracking);
      kernedWidth = width = config.width;
      size = config.height;
      fontCache[_char] = width;
    }
    if (
      (!previousWidth &&
        stylesAreEqual &&
        previousChar &&
        ((previousWidth = measureTextCustom.call(ctx, previousChar, true, null, this.tracking)
          .width),
        (fontCache[previousChar] = previousWidth)),
      stylesAreEqual &&
        !coupleWidth &&
        ((coupleWidth = measureTextCustom.call(ctx, couple, true, null, this.tracking).width),
        (fontCache[couple] = coupleWidth),
        (kernedWidth = coupleWidth - previousWidth) > width))
    ) {
      var diff = kernedWidth - width;
      fontCache[_char] = kernedWidth;
      fontCache[couple] += diff;
      width = kernedWidth;
    }
    return {
      width: width * fontMultiplier,
      kernedWidth: kernedWidth * fontMultiplier,
      height: size,
    };
  },
});

OpentypeIText.fromObject = (options: any, callback: (obj: any) => any) => {
  return callback(new OpentypeIText(options.text, options));
};

export default OpentypeIText;
