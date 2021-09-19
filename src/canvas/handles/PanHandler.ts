class PanHandler {
  canvas: any;

  constructor(canvas) {
    this.canvas = canvas;
  }

  public panHandler = () => {
    let panning = false;
    let lastPosX;
    let lastPosY;

    this.canvas?.on('mouse:up', e => {
      panning = false;
      this.canvas.selection = false;
    });

    this.canvas?.on('mouse:down', function(opt) {
      var evt = opt.e;
      panning = true;

      lastPosX = evt.clientX;
      lastPosY = evt.clientY;
    });

    this.canvas?.on('mouse:move', opt => {
      if (panning && opt && opt.e && this.canvas.defaultCursor === 'grab') {
        this.canvas.selection = false;
        var e = opt.e;
        var vpt = this.canvas.viewportTransform;
        vpt[4] += e.clientX - lastPosX;
        vpt[5] += e.clientY - lastPosY;
        this.canvas.requestRenderAll();
        lastPosX = e.clientX;
        lastPosY = e.clientY;
      } else {
        this.canvas.selection = true;
      }
    });
  };
}

export default PanHandler;
