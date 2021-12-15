import { fabric } from 'fabric';
import { findIndex } from 'lodash';


const CirclePro = fabric.util.createClass(fabric.Circle, {
	type: 'circlePro',
	initialize(options: any) {
		options = options || {};
		this.callSuper('initialize', options);
	},
  countStepForward: function() {
    let step = 0;
    const objects = this.canvas?.getObjects();
    const indexThis = findIndex(objects, { id: this.id });
    let i = indexThis + 1;
    const length = objects.length;
    // let count = 0
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
    const objects = this.canvas?.getObjects();
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
          this.canvas?.bringForward(this);
        }
        break;

      case 'backward':
        const stepBackward = this.countStepBackward();
        for (let i = 0; i < stepBackward; i++) {
          this.canvas?.sendBackwards(this);
        }
        break;

      case 'tofront':
        this.canvas?.bringToFront(this);
        break;

      case 'toback':
        this.canvas?.sendToBack(this);

      default:
        break;
    }

    this.canvas?.renderAll();
  },
	toObject() {
		return fabric.util.object.extend(this.callSuper('toObject'), {
			id: this.get('id'),
		});
	},
	_render(ctx: CanvasRenderingContext2D) {
		this.callSuper('_render', ctx);
	},
});

CirclePro.fromObject = (options: any, callback: (obj: any) => any) => {
	return callback(new CirclePro(options));
};

var windowFabric: any = window.fabric;
windowFabric.CirclePro = CirclePro;

export default CirclePro
