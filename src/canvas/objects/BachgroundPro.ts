import { fabric } from 'fabric';

const BackgroundPro = fabric.util.createClass(fabric.Rect, {
  type: 'backgroundPro',
  text: null,
  textbox: false,
  textOffsetLeft: 0,
  textOffsetTop: 0,
  _prevObjectStacking: null,
  _prevAngle: 0,
  textHeight: 0,
  textWidth: 0,
  image: null,
  imageSelected: false,
  rangeLeft: 0,
  rangeTop: 0,
  rangeAngle: 0,
  addImageToRectInit: null,
  previousAngle: null,
  elementId: 1,

  initialize(rectOptions: any) {
    // console.log(rectOptions.width, rectOptions.width, 'ahihi');

    this.on('added', () => {
      const center = this.canvas.getCenter();
      this.top = center.top;
      this.left = center.left;
      const zoomWidth = rectOptions.typeRender ? 0 : 0.15;
      const zoomTop = rectOptions.typeRender ? 0 : 25;

      if (rectOptions.src) {
        fabric.Image.fromURL(rectOptions.src, (myImg: any) => {
          myImg.set({
            originX: 'center',
            originY: 'center',
            width: myImg.width,
            height: myImg.height,
            crossOrigin: 'anonymous',
            backgroundColor: rectOptions.fill || '#fff',
          });

          this.canvas.setBackgroundImage(myImg, this.canvas.renderAll.bind(this.canvas));
          if (myImg.width >= myImg.height) {
            this.canvas.setViewportTransform([
              this.canvas.width / myImg.width - 0.1,
              0,
              0,
              this.canvas.width / myImg.width - 0.1,
              this.canvas.getCenter().left,
              this.canvas.getCenter().top,
            ]);
          } else {
            this.canvas.setViewportTransform([
              this.canvas.height / myImg.height - zoomWidth,
              0,
              0,
              this.canvas.height / myImg.height - zoomWidth,
              this.canvas.getCenter().left,
              this.canvas.getCenter().top,
            ]);
          }

          //render image
          if (rectOptions.typeRender) {
            console.log('vl');
            fabric.Object.NUM_FRACTION_DIGITS = 10;
            const link = document.createElement('a');
            const dataURL = this.canvas.toDataURL({ format: 'png' });
            link.download = 'image.png';
            link.href = dataURL;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        });
      } else {
        const bgUrl =
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=';
        // const bgUrl = 'https://st.quantrimang.com/photos/image/2020/07/30/Hinh-Nen-Trang-10.jpg';
        fabric.Image.fromURL(
          bgUrl,
          (myImg: any) => {
            myImg.set({
              originX: 'center',
              originY: 'center',
              width: rectOptions.width || 1000,
              height: rectOptions.height || 1000,
              crossOrigin: 'anonymous',
              backgroundColor: rectOptions.fill || '#fff',
            });
            // anonymous", "allow-credentials"
            var filter = new fabric.Image.filters.BlendColor({
              color: rectOptions.fill || '#fff',
              mode: 'tint',
            });
            myImg.filters.push(filter);
            myImg.applyFilters();
            this.canvas.setBackgroundImage(myImg, this.canvas.renderAll.bind(this.canvas));

            if (this.canvas.width <= this.canvas.height) {
              this.canvas.setViewportTransform([
                this.canvas.width / myImg.width - zoomWidth,
                0,
                0,
                this.canvas.width / myImg.width - zoomWidth,
                this.canvas.getCenter().left,
                this.canvas.getCenter().top + zoomTop,
              ]);
              this.canvas.requestRenderAll();
              this.canvas.renderAll();
            } else {
              this.canvas.setViewportTransform([
                this.canvas.height / myImg.height - zoomWidth,
                0,
                0,
                this.canvas.height / myImg.height - zoomWidth,
                this.canvas.getCenter().left,
                this.canvas.getCenter().top + zoomTop,
              ]);
              this.canvas.requestRenderAll();
              this.canvas.renderAll();
            }

            //render image
            if (rectOptions.typeRender) {
              console.log('vl hihi');
              fabric.Object.NUM_FRACTION_DIGITS = 10;
              const link = document.createElement('a');
              const dataURL = this.canvas.toDataURL({ format: 'png' });
              link.download = 'image.png';
              link.href = dataURL;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }
          },
          { crossOrigin: 'anonymous' },
        );
        // })
      }

      this.canvas.renderAll();
    });

    this.on('removed', () => {
      this.canvas.remove(this.text);
    });

    this.on('scaling', () => {
      this.strokeWidth = 1;
      this.stroke = '#333';

      this.image && this.recalcImage();
      if (this.images) this.image.top = this.top;
    });

    this.on('scaled', (e: any) => {
      this.width = Math.round(e.target.width * e.target.scaleX);
      this.height = Math.round(e.target.height * e.target.scaleY);
      this.scaleX = 1;
      this.scaleY = 1;

      // set range left vs top before move
      this.rangeLeft = e.target.image?.left - this.left;
      this.rangeTop = e.target.image?.top - this.top;

      this.canvas.renderAll();
    });

    this.on('mousedown:before', (event: any) => {
      this.selectable = true;
      this.evented = true;
      this.stroke = 'red';
      this.canvas.setActiveObject(this);

      if (this.image) {
        // set range left vs top before move
        this.rangeLeft = event.target.image?.left - this.left;
        this.rangeTop = event.target.image?.top - this.top;
        // this.rangeAngle = event.target.image?.angle - this.angle;

        this.image.selectable = false;
        this.image.evented = false;

        this.canvas.setActiveObject(this);
        this.selectable = true;
      }
      this._prevObjectStacking = this.canvas.preserveObjectStacking;
      this.canvas.preserveObjectStacking = true;
      this.strokeWidth = 0;
      this.canvas.renderAll();
    });

    this.on('mousedblclick', () => {
      this.canvas.centerObject(this);

      return this.canvas.renderAll();
    });

    this.on('selected', () => {
      this.selectable = true;
      this._prevObjectStacking = this.canvas.preserveObjectStacking;
      this.canvas.preserveObjectStacking = true;
      this.canvas.renderAll();
    });

    this.on('deselected', () => {
      this.canvas.preserveObjectStacking = this._prevObjectStacking;
      this.strokeWidth = 1;
      this.canvas.renderAll();
    });
  },

  setBackground: function(zoom: any) {
    const center = this.canvas.getCenter();

    this.canvas.zoomToPoint({ x: center.left, y: center.top }, zoom);

    return this.canvas.renderAll();
  },

  updatePan: function() {},

  // render
  _render(ctx: any) {
    this.callSuper('_render', ctx);
    ctx.save();
  },
});

BackgroundPro.fromObject = (options: any, callback: any) => {
  return callback(new BackgroundPro(options));
};

var windowFabric: any = window.fabric;

windowFabric.BackgroundPro = BackgroundPro;

export default BackgroundPro;
