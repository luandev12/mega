import { fabric } from 'fabric';

class ZoomHandler {
  canvas: any;

  constructor(canvas) {
    this.canvas = canvas;
    this.initialize();
  }

  public initialize = (state = []) => {};

  public zoomHandler = (decrement: number = 0, obj) => {
    let width = 1000;
    let height = 1000;

    if (obj) {
      width = obj.width;
      height = obj.height;
    }
    let scaleX = this.canvas.getWidth() / width;
    const scaleY = this.canvas.getHeight() / height;
    if (height >= width) {
      scaleX = scaleY;
      if (this.canvas.getWidth() < width * scaleX) {
        scaleX = scaleX * (this.canvas.getWidth() / (width * scaleX));
      }
    } else {
      if (this.canvas.getHeight() < height * scaleX) {
        scaleX = scaleX * (this.canvas.getHeight() / (height * scaleX));
      }
    }
    const center = this.canvas.getCenter();

    this.canvas.zoomToPoint(new fabric.Point(center.left, center.top), scaleX - decrement);
  };

  public wheelHandler = () => {
    this.canvas?.on('mouse:wheel', opt => {
      const center = this.canvas.getCenter();
      var delta = opt.e.deltaY;
      var zoom = this.canvas.getZoom();

      zoom *= 0.999 ** delta;
      if (zoom > 10) zoom = 10;
      if (zoom < 0.1) zoom = 0.1;
      this.canvas.zoomToPoint({ x: center.left, y: center.top }, zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();
    });
  };
}

export default ZoomHandler;
