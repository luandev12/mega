import { WorkareaObject, FabricObjectOption } from '../utils';

export const canvasOption = {
  preserveObjectStacking: true,
  controlsAboveOverlay: true,
  width: 300,
  height: 150,
  selection: true,
  defaultCursor: 'default',
  backgroundColor: '#c8c8cf',
};

export const workareaOption: Partial<WorkareaObject> = {
  width: 1000,
  height: 1000,
  workareaWidth: 1000,
  workareaHeight: 1000,
  lockScalingX: true,
  lockScalingY: true,
  scaleX: 1,
  scaleY: 1,
  backgroundColor: '#fff',
  hasBorders: false,
  hasControls: false,
  selectable: false,
  lockMovementX: true,
  lockMovementY: true,
  hoverCursor: 'default',
  name: '',
  id: 'workarea',
  type: 'backgroundPro',
  layout: 'responsive', // fixed, responsive, fullscreen
  link: {},
  tooltip: {
    enabled: false,
  },
  isElement: false,
  fill: '#ffffff'
};

export const gridOption = {
  enabled: false,
  grid: 10,
  snapToGrid: false,
  lineColor: '#ebebeb',
  borderColor: '#cccccc',
};

export const keyEvent = {
  move: true,
  all: true,
  copy: true,
  paste: true,
  esc: true,
  del: true,
  clipboard: false,
  transaction: true,
  zoom: true,
  cut: true,
};

export const propertiesToInclude = ['id', 'name', 'locked', 'editable'];

export const objectOption: Partial<FabricObjectOption> = {
  rotation: 0,
  centeredRotation: true,
  strokeUniform: true,
};

export const guidelineOption = {
  enabled: true,
};

export const activeSelectionOption = {
  hasControls: true,
};

export const groupBoundedOption = {
  async: true,
  superType: "husblizer",
  cornerColor: "#18a0fb",
  borderColor: "#18a0fb",
  borderScaleFactor: 2,
  lockScalingFlip: true,
  originX: "center",
  originY: "center",
  objectCaching: false,
  padding: -1,
  globalCompositeOperation: 'source-atop',
  strokeWidth: 0,
};

export const rectOption = {
  strokeDashArray: [10, 12],
  originX: "center",
  originY: "center",
  stroke: "#808080",
  strokeWidth: 1,
  // width: 300,
  // height: 300,
  fill: "rgba(0, 0, 0, 0)",
  strokeUniform: true,
  globalCompositeOperation: 'source-atop'
};

export const workareaOptionMore = {
  version: "2.0.0",
  zoomFit: 0.1,
  imageWhiteUrl:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=",
};

export const backgroundPro = {
  type: 'backgroundPro',
  originX: 'center',
  originY: 'center',
  left: 0,
  top: 0,
  stroke: '#bbb',
  strokeWidth: 1,
  strokeDashArray: [7, 7],
  strokeLineCap: 'butt',
  strokeDashOffset: 0,
  strokeLineJoin: 'miter',
  strokeUniform: true,
  strokeMiterLimit: 4,
  scaleX: 1,
  scaleY: 1,
  angle: 0,
  flipX: false,
  flipY: false,
  opacity: 1,
  shadow: null,
  visible: true,
  backgroundColor: '',
  fillRule: 'nonzero',
  globalCompositeOperation: 'source-over',
  skewX: 0,
  skewY: 0,
  rx: 0,
  ry: 0,
  src: "",
}

export const lockObject = {
  lockRotation: true,
  lockMovementX: true,
  lockMovementY: true,
  lockScalingX: true,
  lockScalingY: true
}