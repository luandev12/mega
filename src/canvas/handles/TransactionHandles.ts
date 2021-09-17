import { fabric } from 'fabric';
import throttle from 'lodash/throttle';

import { FabricObject } from '../utils';
import { backgroundPro } from '../constants/defaults';
// import { NodeObject } from '../objects/Node';
// import { LinkObject } from '../objects/Link';

export type TransactionType =
	| 'add'
	| 'remove'
	| 'moved'
	| 'scaled'
	| 'rotated'
	| 'skewed'
	| 'group'
	| 'ungroup'
	| 'paste'
	| 'bringForward'
	| 'bringToFront'
	| 'sendBackwards'
	| 'sendToBack'
	| 'redo'
	| 'undo';

export interface TransactionTransform {
	scaleX?: number;
	scaleY?: number;
	skewX?: number;
	skewY?: number;
	angle?: number;
	left?: number;
	top?: number;
	flipX?: number;
	flipY?: number;
	originX?: string;
	originY?: string;
}

export interface TransactionEvent {
	json: string;
	type: TransactionType;
}

class TransactionHandler {
	redos: TransactionEvent[];
	undos: TransactionEvent[];
	active: boolean = false;
	state: FabricObject[] = [];
  canvas: any
	constructor(canvas) {
    this.canvas = canvas
    this.initialize();
  }

	/**
	 * Initialize transaction handler
	 *
	 */
	public initialize = (state = []) => {
		this.redos = [];
		this.undos = [];
		this.state = state;
		this.active = false;
	};

	/**
	 * Save transaction
	 *
	 * @param {TransactionType} type
	 * @param {*} [canvasJSON]
	 * @param {boolean} [isWorkarea=true]
	 */
	public save = (type: TransactionType, canvasJSON?: any, _isWorkarea: boolean = true) => {
		try {
			if (this.state) {
				const json = JSON.stringify(this.state);
				this.redos = [];
				this.undos.push({
					type,
					json,
				});
			}
			const { objects } = canvasJSON || this.canvas.toJSON();
      console.log(this.state, 'this.state')
			this.state = objects.map(item => {
				if (item.type === "backgroundPro") {
					const background: any = {}
          console.log(this.canvas.backgroundImage, 'this.canvas.backgroundImage')
					const { width, height, backgroundColor, _originalElement }: any = this.canvas.backgroundImage
					background.width = width
					background.height = height
					background.fill = backgroundColor
					background.src = _originalElement?.currentSrc.slice(0, 4) === "data" ? "" : _originalElement?.currentSrc 

					return { ...item, ...background }
				}

				return item
			})
		} catch (error) {
			console.error(error);
		}
	};

	/**
	 * Undo transaction
	 *
	 */
	public undo = throttle(() => {
		const undo = this.undos.pop();
		if (!undo) {
			return;
		}
		this.redos.push({
			type: 'redo',
			json: JSON.stringify(this.state),
		});
		this.replay(undo);
	}, 100);

	/**
	 * Redo transaction
	 *
	 */
	public redo = throttle(() => {
		const redo = this.redos.pop();
		if (!redo) {
			return;
		}
		this.undos.push({
			type: 'undo',
			json: JSON.stringify(this.state),
		});
		this.replay(redo);
	}, 100);

	/**
	 * Replay transaction
	 *
	 * @param {TransactionEvent} transaction
	 */
	public replay = (transaction: TransactionEvent) => {
		const objects = JSON.parse(transaction.json) as FabricObject[];
		this.state = objects;
		this.active = true;
		this.canvas.renderOnAddRemove = false;
		this.canvas.clear();
		this.canvas.discardActiveObject();
		fabric.util.enlivenObjects(
      objects,
			(enlivenObjects: FabricObject[]) => {
				enlivenObjects.forEach(obj => {
					const targetIndex = this.canvas._objects.length;
          this.canvas.insertAt(obj, targetIndex, false);
				});
				this.canvas.renderOnAddRemove = true;
				this.active = false;
				this.canvas.renderAll();
				setTimeout(() => {
          const { width, height }: any = this.canvas.backgroundImage
					this.zoomHandler(0.15, { width, height });
				}, 0)
			},
			null,
		);
	};

  public zoomHandler = (decrement: number = 0, obj) => {
    let width = 1000
    let height = 1000
    if (obj) {
      width = obj.width
      height = obj.height
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
        scaleX =
          scaleX * (this.canvas.getHeight() / (height * scaleX));
      }
    }
    const center = this.canvas.getCenter();
    // this.handler.canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    this.canvas.zoomToPoint(new fabric.Point(center.left, center.top), scaleX - decrement);
  };
}

export default TransactionHandler;
