import opentype from 'opentype.js';
export interface HusblizerFont {
  [key: string]: opentype.Font;
}

declare global {
  interface Window {
    husblizerFont: HusblizerFont;
  }
}

// window.husblizerFont = {};
class HFont {
  static resolve = (key: any): opentype.Font => {
    key = key
      .replace(/"/g, '')
      .replace(/'/g, '')
      .toLowerCase();
    return window.husblizerFont[key];
  };

  static hasFont = (key: string): boolean => {
    key = key
      .replace(/"/g, '')
      .replace(/'/g, '')
      .toLowerCase();
    // console.log(window.husblizerFont, key)
    if (window.husblizerFont[key]) {
      return true;
    }

    return false;
  };

  static loadSync(key: string, fontUrl: string) {
    opentype.load(fontUrl, function(error, data: any) {
      key = key
        .replace(/"/g, '')
        .replace(/'/g, '')
        .toLowerCase();
      if (error) {
        console.error('Error loading font ' + key + ' at ' + fontUrl, error);
      } else {
        window.husblizerFont[key] = data;
        // console.log(key, window.husblizerFont)
        let glyphStatus = null;
        let glyph;
        const status = 'x';
        var ymax = -99999999;
        var ymin = 99999999;
        for (let i = 0; i < data.glyphs.length; i++) {
          if (data.glyphs.get(i).name === status) {
            glyphStatus = data.glyphs.get(i);
            break;
          }
        }
        if (!glyphStatus) {
          for (let i = 0; i < data.glyphs.length; i++) {
            if (data.glyphs.get(i).name === status.toUpperCase()) {
              glyphStatus = data.glyphs.get(i);
              break;
            }
          }
        }
        if (glyphStatus) {
          var statusMetric = glyphStatus.getMetrics();
          for (let i = 0; i < data.glyphs.length; i++) {
            glyph = data.glyphs.get(i);
            var bounds = glyph.getMetrics();
            if ('undefined' !== typeof bounds.yMin) {
              glyph.descent = Math.abs(bounds.yMin);
              glyph.ascent = Math.abs(statusMetric.yMax - bounds.yMax);
            } else {
              glyph.ascent = 0;
              glyph.descent = 0;
            }
          }
        } else {
          console.warn("Couldn't find pattern Glyph for font: " + key);
          for (let i = 0; i < data.glyphs.length; i++) {
            data.glyphs.get(i).descent = 0;
          }
        }

        for (let i = 0; i < data.glyphs.length; i++) {
          var glyphMetric = data.glyphs.get(i).getMetrics();
          if ('undefined' !== typeof glyphMetric.yMin) {
            ymax = Math.max(glyphMetric.yMax, ymax);
            ymin = Math.min(glyphMetric.yMin, ymin);
          }
        }

        data.totalDescender = ymin;
        data.totalAscender = ymax;
        data.fontHeight = Math.abs(ymax - ymin);
      }
    });
  }
}

export default HFont;
