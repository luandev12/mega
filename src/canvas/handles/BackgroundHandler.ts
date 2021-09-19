import { fabric } from 'fabric';

class ZoomHandler {
  canvas: any;

  constructor(canvas) {
    this.canvas = canvas;
  }

  public bgHandler = (decrement: number = 0, myImg: any, obj, color: string) => {
    const widthBg = obj.width;
    const heightBg = obj.height;

    myImg.set({
      originX: 'center',
      originY: 'center',
      width: widthBg,
      height: heightBg,
      crossOrigin: 'anonymous',
      backgroundColor: color,
    });

    var filter = new fabric.Image.filters.BlendColor({
      color,
      mode: 'tint',
    });

    myImg.filters.push(filter);
    myImg.applyFilters();

    this.canvas.setBackgroundImage(myImg, this.canvas.renderAll.bind(this.canvas));

    if (this.canvas.width <= this.canvas.height) {
      this.canvas.setViewportTransform([
        this.canvas.width / widthBg - decrement,
        0,
        0,
        this.canvas.width / widthBg - decrement,
        this.canvas.getCenter().left,
        this.canvas.getCenter().top + 25,
      ]);
      this.canvas.requestRenderAll();
      this.canvas.renderAll();
    } else {
      this.canvas.setViewportTransform([
        this.canvas.height / heightBg - decrement,
        0,
        0,
        this.canvas.height / heightBg - decrement,
        this.canvas.getCenter().left,
        this.canvas.getCenter().top + 25,
      ]);
      this.canvas.requestRenderAll();
      this.canvas.renderAll();
    }
  };
}

export default ZoomHandler;
