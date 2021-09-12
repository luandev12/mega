import React from 'react';
import { fabric } from 'fabric';

import Style from './Style';

interface Props {
  canvas: any;
  color: string;
}

export default function index({ canvas, color }: Props) {
  const exportPng = () => {
    const objRender = canvas.getObjects().map(obj => {
      const item = { ...obj.toJSON() };

      if (item.type === 'backgroundPro') {
        item.fill = color;
        item.height = 1000;
        item.width = 1000;
      }

      console.log(item);
      item.typeRender = true;
      return item;
    });

    const canvasRender = new fabric.Canvas(null, {});

    canvasRender.width = 1000;
    canvasRender.height = 1000;

    canvasRender.loadFromJSON(
      {
        objects: objRender,
      },
      canvasRender.renderAll.bind(canvasRender),
    );

    canvasRender.renderAll.bind(canvasRender);
    canvasRender.renderAll();
  };

  return (
    <Style>
      <div className="d-flex justify-content-end mr-3">
        <div className="header-export" onClick={exportPng}>
          Export
        </div>
      </div>
    </Style>
  );
}
