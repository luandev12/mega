import * as Diff from 'diff';
import { fabric } from 'fabric';
import OpentypeIText from './OpentypeIText';
import { defaults } from '../constants';
import { v4 as uuidv4 } from 'uuid';
import { findIndex } from 'lodash';
import { percentToHex } from '../../ultis';

const TextBoxPro = fabric.util.createClass(fabric.Group, {
  async: true,
  type: 'textBoxPro',
  lockUniScalingWithSkew: false,
  debug: false,
  version: '4.3.1',
  lineSpacing: 1,
  _textWithoutPrefixSuffix: '',
  initialize: function(options: any) {
    if (options.fontFamily) {
      options.fontFamily = this._sanitizeFontFamily(options.fontFamily);
    }
    options.version = options.version || TextBoxPro.prototype.version;
    this.selectable = options.selectable === false ? false : true;
    this.visible = options.visible === false ? false : true;
    this.evented = this.selectable;
    options.evented = this.selectable;
    this.opacityFill = options.opacityFill || 100;
    this.opacityStroke = options.opacityStroke || 100;
    this.fontUrl = options.fontUrl;
    this.fills =
      options.fills && options.fills.length > 0
        ? options.fills
        : [{ fill: options.fill?.slice(0, 7), id: 1 }];
    var txtFilter;
    var defaultss = {
      width: options.width || 300,
      height: options.height || 300,
      fontSize: options.fontSize || 200,
      originX: 'center',
      originY: 'center',
      textAlign: options.textAlign || 'center',
      centeredRotation: true,
      color: options.color || 'black',
      fontFamily: options.fontFamily || 'allitta_calligraphy',
      backgroundColor: this.debug ? '#f7dacf' : 'rgba(0,0,0,0)',
      tracking: options.tracking || 0,
      version: options.version,
      stroke:
        `${options.stroke?.slice(0, 7)}${percentToHex(options.opacityStroke || 100)}` || '#000000',
      lockScalingFlip: true,
      globalCompositeOperation: 'source-atop',
      fill: '#000000',
      opentypeStrokeWidth: options.strokeWidth || 0,
      opentypeStroke: options.stroke || '#000000',
    };
    txtFilter = new OpentypeIText('Type here', defaultss);
    this.set('originalText', 'Type here');
    this.set('_textWithoutPrefixSuffix', 'Type here');
    var r = new fabric.Rect({
      strokeDashArray: options.strokeDashArray,
      originX: 'center',
      originY: 'center',
      stroke: options.typeRender ? 'transparent' : '#808080',
      strokeWidth: options.typeRender ? 0 : 1,
      borderColor: options.typeRender ? 'transparent' : '#18a0fb',
      width: options.width || 300,
      height: options.height || 300,
      fill: 'rgba(0, 0, 0, 0)',
    });
    this.set('caps', false);
    this.callSuper(
      'initialize',
      [txtFilter, r],
      Object.assign(options, defaults.groupBoundedOption),
    );
    this.setTextAlign(options.textAlign || 'center');
    this.objectCaching = false;
    this._updateFont();
    this.on({
      scaling: function(val: any) {
        const step = window.location.search?.split('=')[1];
        if (this.lockUniScalingWithSkew) {
          var s = 1;
          s = 'scaleX' === val.transform.action ? this.scaleX : this.scaleY;
          this.scaleX = s;
          this.scaleY = s;
        }

        if (step === '2') {
          this.minSize = this.minSize * this.scaleX;
          this.maxSize = this.maxSize * this.scaleX;
        }
        var w = this.width * this.scaleX;
        var height = this.height * this.scaleY;
        this.scaleX = 1;
        this.scaleY = 1;
        this.setWidth(w);
        this.setHeight(height);
        this.setTextAlign(this.getTextAlign());
      },
      added: function() {
        // this.cornerSize = .025 * this.canvas.width;
        this.transparentCorners = true;
        // this._updateFont();
        // this.setWidth(this.width);
        // this.setHeight(this.height);
        this.updateFromGroupScaling();
        setTimeout(() => {
          this.setPrefixSuffix('Type here', options.prefix || '', options.suffix || '');
        });
      },
    });
  },
  updateFromGroupScaling: function() {
    var w = this.width * this.scaleX;
    var height = this.height * this.scaleY;
    this.scaleX = 1;
    this.scaleY = 1;
    this.setWidth(w);
    this.setHeight(height);
    this.setTextAlign(this.getTextAlign());
  },
  _set: function(key: any, value: any) {
    if ('textAlign' === key) {
      this.setTextAlign(value);
    } else {
      if ('caps' === key) {
        this.setCaps(value);
      } else {
        if ('text' === key) {
          this.setText(value);
        } else {
          if ('outlineWidth' === key) {
            this.setOutlineWidth(value);
          } else {
            if ('fontFamily' === key) {
              this.setFontFamily(value);
            } else {
              if ('fill' === key && value.constructor === fabric.Pattern) {
                this.item(0).set('fillPattern', value);
              } else {
                if ('version' === key) {
                  /** @type {!Object} */
                  this.version = value;
                  this.item(0).set('version', value);
                } else {
                  if ('lineSpacing' === key) {
                    this.callSuper('_set', key, value);
                    this.item(0).set('lineSpacing', value);
                  } else {
                    if ('ligatures' === key) {
                      this.callSuper('_set', key, value);
                      this.item(0).set('ligatures', value);
                    } else {
                      this.callSuper('_set', key, value);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  getTextPaths: function() {
    return this.item(0).getTextPaths(this.getWidth(), this.getHeight());
  },
  setTopLeft: function(top: number, left: number) {
    this.set({
      top: top,
      left: left,
    });
  },
  setPrefixSuffix: function(text: string, prefix: string, suffix: string) {
    this.prefix = prefix;
    this.suffix = suffix;
    this.setText(text);
  },
  setSkewXY: function(skewX: number, skewY: number) {
    this.set({
      skewX: skewX,
      skewY: skewY,
    });
  },
  setMinMaxSize: function(text: string, minSize: number, maxSize: number) {
    this.minSize = minSize;
    this.maxSize = maxSize;
    this.setText(text, true);
  },
  setLetterSpacing: function(letterSpacing: number) {
    this.item(0).set('tracking', letterSpacing || 0);
    this._updateFont();
  },
  setLineHeight: function(lineHeight: number) {
    this.set({ lineSpacing: lineHeight });
    this._updateFont();
  },
  setTextAlign: function(align: any) {
    var origWidth;
    var width_box;
    if ('opentype-itext' == this.item(0).type) {
      this.item(0).set('textAlign', align);
      this.item(0).set('dirty', true);
      this.canvas && this.canvas.renderAll();
      switch (align) {
        case 'center':
          this.item(0).set({
            left: 0,
            top: 0,
          });
          break;
        case 'left':
        case 'justify':
          origWidth = this.item(0).width;
          width_box = (this.getWidth() - origWidth) / 2;
          this.item(0).set({
            left: -width_box,
            top: 0,
          });
          break;
        case 'right':
          origWidth = this.item(0).width;
          width_box = (this.getWidth() - origWidth) / 2;
          this.item(0).set({
            left: width_box,
            top: 0,
          });
      }
      // this._updateFont()
      this.canvas && this.canvas.renderAll();
    }
  },
  setTrackingAmount: function(state: any) {
    this.item(0).set('tracking', state || 0);
  },
  getTrackingAmount: function() {
    return this.item(0).tracking || 0;
  },
  getOutlineWidth: function() {
    return this.item(0).opentypeStrokeWidth || 0;
  },
  setOutlineWidth: function(strokeWidth: number) {
    this.item(0).set('opentypeStrokeWidth', strokeWidth || 0);
    this._updateFont();
  },
  getOutlineColor: function() {
    return this.item(0).opentypeStroke || '#000000';
  },
  setOutlineColor: function(rgba: string) {
    this.item(0).set('opentypeStroke', rgba || '#000000');
    this._updateFont();
  },
  getTextAlign: function() {
    return this.item(0).textAlign;
  },
  setCursorColor: function(p_id: any) {
    /** @type {string} */
    this.item(0).cursorColor = p_id;
  },
  setStroke: function(width: any) {
    this.item(1).set('stroke', width);
  },
  setStrokeWidth: function(width: any) {
    this.item(1).set('strokeWidth', width);
  },
  getStroke: function() {
    return this.item(1).stroke;
  },
  setColor: function(color: string) {
    this.item(0).set({
      fill: color,
    });
    this.canvas.renderAll();
  },
  getColor: function() {
    return this.item(0).fill;
  },
  getText: function() {
    return this._textWithoutPrefixSuffix;
  },
  getTextWithLines: function() {
    return this.item(0).getText();
  },
  setText: function(id: any, start: any) {
    if (!id) {
      id = '';
    }
    this.set('_textWithoutPrefixSuffix', id);
    if (this.caps) {
      id = id.toUpperCase();
    }
    id = (this.prefix || '') + id + (this.suffix || '');
    var n = start ? '' : this.originalText;
    id = this._computeTrimmedText(id, id, this.item(0), this);
    this.set('originalText', id);
    this.item(0).set('text', id);
    this._updateFont();
    return id;
  },
  forceFontSize: function(t: any) {
    this.item(0).set('fontSize', t);
    this.setTextAlign(this.getTextAlign());
  },
  updateFontSize: function() {
    this._updateFont();
  },
  setFontSize: function(size: any) {
    /** @type {number} */
    this.item(0).fontSize = size;
    this._updateFont();
  },
  getFontSize: function() {
    return this.item(0).fontSize;
  },
  _sanitizeFontFamily: function(qNameAsString: any) {
    return (
      qNameAsString.indexOf("'") < 0 && (qNameAsString = "'" + qNameAsString + "'"), qNameAsString
    );
  },
  setFontFamily: function(value: any) {
    value = this._sanitizeFontFamily(value);
    this.item(0).set('fontFamily', value);
    this._updateFont();
    // this._updateFont();
  },
  getFontFamily: function() {
    return this.item(0).fontFamily;
  },
  setWidth: function(width: any) {
    if (!width) {
      /** @type {number} */
      width = 0;
    }
    this.set('width', width);
    this.item(1).set('width', width);
    this.item(0).set('justifyWidth', width);
    this._updateFont();
  },
  getWidth: function() {
    return this.width * this.scaleX;
  },
  setHeight: function(height: any) {
    if (!height) {
      /** @type {number} */
      height = 0;
    }
    this.set('height', height);
    this.item(1).set('height', height);
    this._updateFont();
  },
  getHeight: function() {
    return this.height * this.scaleY;
  },
  setMinSizePx: function(canCreateDiscussions: any) {
    this.minSize = canCreateDiscussions;
    this._updateFont();
  },
  setMaxSizePx: function(canCreateDiscussions: any) {
    this.maxSize = canCreateDiscussions;
    this._updateFont();
  },
  setMultiline: function(multiline: any) {
    this.multiline = multiline;
    this._updateFont();
  },
  setCaps: function(uuid: any) {
    /** @type {!Object} */
    this.caps = uuid;
    if (uuid) {
      this.setText(this.getText().toUpperCase(), true);
    }
    this._updateFont();
  },
  _computeTrimmedText: function(e: any, o: any, b: any, el: any) {
    var d = Diff.diffChars(o, e);
    var a = '';
    var refs = [];
    var j = 0;
    for (; j < d.length; ++j) {
      if (d[j].removed || d[j].added) {
        if (d[j].added) {
          var messageStart = 0;
          if (j > 0) {
            var i = 1;
            for (; j - i >= 0; ++i) {
              if (!d[j - i].removed) {
                messageStart = messageStart + d[j - i].value.length;
              }
            }
          }
          refs.push({
            value: d[j].value,
            start: messageStart,
          });
        }
      } else {
        a = a + d[j].value;
      }
    }
    var break2 = false;
    j = 0;
    for (; j < refs.length && !break2; ++j) {
      var _a = a;
      var i = 0;
      for (; i < refs[j].value.length; ++i) {
        var idx = refs[j].start + i;
        a = a.substr(0, idx) + refs[j].value[i] + a.substr(idx);
        el.set('originalText', a);
        try {
          if ((b.set('text', a), el._updateFont(el, b))) {
            a = _a;
            break2 = true;
            break;
          }
          _a = a;
        } catch (g) {
          return (a = _a), el.set('originalText', a), b.set('text', a), el._updateFont(el, b), a;
        }
      }
    }
    return a;
  },
  _updateFont: function($this: any, itext: any) {
    if (($this || ($this = this), itext || (itext = $this.item(0)), $this.canvas)) {
      var width = $this.getWidth() || $this.width;
      var height = $this.getHeight() || $this.height;
      var minSize = $this.minSize;
      var maxSize = $this.maxSize;
      var multiline = (itext.fontFamily, $this.multiline);
      var ok = false;
      var p = itext;
      p.text = $this.get('originalText');
      $this.item(0).set('dirty', true);
      this.canvas.renderAll();
      var widthRatio =
        width / ('justify' == $this.getTextAlign() ? p.totalWidthNoJustify : p.width);
      var heightRatio = height / p.height;
      var factor = Math.min(widthRatio, heightRatio);
      var fontSize = p.fontSize * factor;
      itext.text = $this.get('originalText');
      if (fontSize < minSize) {
        var str = (' ' + $this.get('originalText')).slice(1);
        var localization = (' ' + $this.get('originalText')).slice(1);
        p.fontSize = minSize;
        if (multiline) {
          var result = (function(elem, width, canvas, $this) {
            var tmp = elem;
            var x = tmp.text;
            var existingChoices = $this.get('originalText').split(' ');
            var constrTypes = [];
            var c = existingChoices[0];
            var i = 1;
            for (; i < existingChoices.length; i++) {
              var value = existingChoices[i];
              elem.set('text', c + ' ' + value);
              canvas.renderAll();
              if (
                ('justify' == $this.getTextAlign() ? tmp.totalWidthNoJustify : tmp.width) < width
              ) {
                c = c + (' ' + value);
              } else {
                constrTypes.push(c);
                c = value;
              }
            }
            return constrTypes.push(c), tmp.set('text', x), canvas.renderAll(), constrTypes;
          })(p, width, $this.canvas, $this);
          str = result.join('\n');
          localization = result.join('\n');
        }
        var end = 0;
        for (; end <= str.length && fontSize < minSize; ++end) {
          localization = str?.slice(0, str.length - end);
          p.text = localization;
          $this.item(0).set('dirty', true);
          $this.canvas.renderAll();
          widthRatio =
            width / ('justify' == $this.getTextAlign() ? p.totalWidthNoJustify : p.width);
          heightRatio = height / p.height;
          factor = Math.min(widthRatio, heightRatio);
          fontSize = p.fontSize * factor;
        }
        if (fontSize > maxSize) {
          fontSize = maxSize;
        } else if (fontSize < minSize) {
          fontSize = minSize;
        }
        itext.fontSize = fontSize;
        itext.text = localization;
        $this.fontSize = itext.fontSize;
        if (end > 1) {
          ok = true;
        }
      } else {
        itext.fontSize = fontSize > maxSize ? maxSize : fontSize;
        $this.fontSize = itext.fontSize;
      }
      $this.setTextAlign(this.getTextAlign());
      $this.canvas.renderAll();
      $this.item(0).set('dirty', true);
      $this.canvas.renderAll();
      return ok;
    }
  },
  updateText: function(name: string, value: string, onKey: string) {
    // this.set("originalText", value)
    this.setText(value);
    // this.item(0).set("text", input.value)
    this._updateFont();
  },

  updateCalcPostion: function(name: string, value: number) {
    if (name === 'left') {
      this.left = value; // - this.width / 2; // rect
    }

    if (name === 'top') {
      this.top = value; //  - this.height / 2; // rect
    }

    if (name === 'width') {
      this.setWidth(value);
    }

    if (name === 'height') {
      this.setHeight(value);
    }

    if (name === 'angle') {
      this.angle = value;
    }

    if (name === 'fontSize') {
      this.setFontSize(value);
    }

    if (name === 'minSize' && value <= this.maxSize) {
      this.minSize = value;
      this._updateFont();
    }

    if (name === 'maxSize') {
      this.maxSize = value;
      this._updateFont();
    }

    if (name === 'skewX') {
      this.skewX = value;
    }

    if (name === 'skewY') {
      this.skewY = value;
    }

    if (name === 'strokeWidth') {
      this.setOutlineWidth(value);
      // this._updateFont()
    }

    if (name === 'elementId') {
      this.elementId = value;
    }

    if (name === 'opacityFill') {
      this.opacityFill = value;
      const hex = this.item(0).fill?.slice(0, 7);
      this.setColor(`${hex}${percentToHex(value)}`);
    }

    if (name === 'opacityStroke') {
      this.opacityStroke = value;
      const hex = this.item(0).opentypeStroke?.slice(0, 7);
      this.setOutlineColor(`${hex}${percentToHex(value)}`);
    }

    if (name === 'optionFill') {
      this.optionFill = value;
    }

    if (name === 'fills') this.fills = value;
    this.canvas.renderAll();
  },
  updateColor: function(name: string, value: string) {
    if (name === 'stroke') {
      this.setOutlineColor(`${value}${percentToHex(this.opacityStroke)}`);
    }

    if (name === 'fill') {
      this.setColor(`${value}${percentToHex(this.opacityFill)}`);
    }

    this.canvas.renderAll();
  },
  updateAlign: function(align: string) {
    this.setTextAlign(align);
    // this._updateFont();
  },
  updateFont: function(font: string, fontUrl) {
    this.setFontFamily(font);
    this.fontUrl = fontUrl;
  },
  changeMultiline: function(name: string, value: boolean) {
    this.setMultiline(value);
  },
  handlePickColor: function() {
    this.canvas.defaultCursor = 'copy';
    this.canvas.renderAll();
  },

  handlePickStroke: function() {
    this.canvas.defaultCursor = 'copy';
    this.canvas.renderAll();
  },
  __updateView: function() {
    this.visible = !this.visible;
    this.canvas.renderAll.bind(this.canvas);
    this.canvas.renderAll();
  },
  __updateLock: function() {
    this.selectable = !this.selectable;
    this.evented = this.selectable;

    this.canvas.renderAll.bind(this.canvas);
    this.canvas.renderAll();
  },
  _updateName: function(name) {
    this.name = name;
  },
  countStepForward: function() {
    let step = 0;
    const objects = this.canvas.getObjects();
    const indexThis = findIndex(objects, { id: this.id });
    let i = indexThis + 1;
    const length = objects.length;
    let count = 0;
    while (i < length) {
      step++;
      if (objects[i].id) {
        return step;
      }
      i++;
    }
    return step;
  },
  countStepBackward: function() {
    let step = 0;
    const objects = this.canvas.getObjects();
    const indexThis = findIndex(objects, { id: this.id });
    let i = indexThis - 1;
    let count = 0;
    while (i >= 1) {
      if (objects[i].id) {
        count++;
      }

      if (count === 1) {
        step++;
      } else {
        if (count === 2) {
          return step;
        }
      }
      i--;
    }

    return step;
  },
  setZIndex: function(name: string) {
    switch (name) {
      case 'forward':
        const stepForward = this.countStepForward();
        for (let i = 0; i < stepForward; i++) {
          this.canvas.bringForward(this);
        }
        break;

      case 'backward':
        const stepBackward = this.countStepBackward();
        for (let i = 0; i < stepBackward; i++) {
          this.canvas.sendBackwards(this);
        }
        break;

      case 'tofront':
        this.canvas.bringToFront(this);
        break;

      case 'toback':
        this.canvas.sendToBack(this);

      default:
        break;
    }

    this.canvas.renderAll();
  },
  cloneObject: function() {
    const { onAdd, propertiesToInclude } = this;
    const activeObject = this.canvas.getActiveObject();
    if (!activeObject) {
      return;
    }
    if (typeof activeObject.cloneable !== 'undefined' && !activeObject.cloneable) {
      return;
    }
    activeObject.clone((clonedObj: any) => {
      this.canvas.discardActiveObject();
      clonedObj.set({
        left: clonedObj.left + 10,
        top: clonedObj.top + 10,
        evented: true,
        name: clonedObj.name + ' (cloned)',
      });
      if (clonedObj.type === 'activeSelection') {
        const activeSelection = clonedObj as fabric.ActiveSelection;
        activeSelection.canvas = this.canvas;
        activeSelection.forEachObject((obj: any) => {
          obj.set('id', uuidv4());
          this.canvas.add(obj);
          this.objects = this.getObjects();
          if (obj.dblclick) {
            obj.on('mousedblclick', this.eventHandler.object.mousedblclick);
          }
        });
        if (onAdd) {
          onAdd(activeSelection);
        }
        activeSelection.setCoords();
      } else {
        if (activeObject.id === clonedObj.id) {
          clonedObj.set('id', uuidv4());
        }
        this.canvas.add(clonedObj);
        this.canvas.objects = this.canvas.getObjects();
        if (clonedObj.dblclick) {
          clonedObj.on('mousedblclick', this.eventHandler.object.mousedblclick);
        }
        if (onAdd) {
          onAdd(clonedObj);
        }
      }
      this.canvas.setActiveObject(clonedObj);
      this.canvas.requestRenderAll();
    }, propertiesToInclude);
  },
  toObject: function() {
    return fabric.util.object.extend(this.callSuper('toObject'), {
      id: this.id,
      objects: null,
      name: this.name,
      elementId: this.elementId,
      value: this.value,
      fontSize: this.item(0).fontSize,
      fontId: '',
      fontFamily: this.item(0).fontFamily,
      fonts: [],
      minSize: this.minSize,
      maxSize: this.maxSize,
      tracking: this.item(0).tracking,
      lineSpacing: this.lineSpacing,
      textAlign: this.item(0).textAlign,
      caps: this.caps,
      multiline: this.multiline,
      fill: this.fills[0]?.fill || this.item(0).fill,
      fillId: '',
      fills: this.fills,
      stroke: this.item(0).opentypeStroke,
      strokeWidth: this.item(0).opentypeStrokeWidth,
      borderWidth: this.item(1).strokeWidth,
      prefix: this.prefix,
      suffix: this.suffix,
      originalText: this.originalText,
      step: this.step,
      fontUrl: this.fontUrl,
      selectable: this.selectable,
      visible: this.visible,
      evented: this.evented,
      opacityFill: this.opacityFill || 100,
      opacityStroke: this.opacityStroke || 100,
      optionFill: 1,
    });
  },

  _render(ctx: any) {
    this.callSuper('_render', ctx);
    ctx.save();
  },
});

TextBoxPro.fromObject = (options: any, callback: (obj: any) => any) => {
  return callback(new TextBoxPro(options));
};

var windowFabric: any = window.fabric;

windowFabric.TextBoxPro = TextBoxPro;

export default TextBoxPro;
