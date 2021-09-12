import React from 'react';
import { fabric } from 'fabric';

import Style from './Style';

import { getBlobFromUrl } from '@/ultis/index';

interface Props {
  canvas: any;
  color: string;
}

export default function index({ canvas, color }: Props) {
  const exportPng = async () => {
    const objRender = canvas.getObjects().map(async obj => {
      const item = { ...obj.toJSON() };

      if (item.type === 'backgroundPro') {
        item.fill = color;
        item.height = 1000;
        item.width = 1000;
      }

      if (item.src) {
        const src: any = await getBlobFromUrl(item.src);
        item.src = src;
      }

      item.typeRender = true;
      return item;
    });

    const canvasRender = new fabric.Canvas(null, {});

    canvasRender.width = 1000;
    canvasRender.height = 1000;

    Promise.all(objRender).then(data => {
      canvasRender.loadFromJSON(
        {
          objects: data,
        },
        canvasRender.renderAll.bind(canvasRender),
      );

      canvasRender.renderAll.bind(canvasRender);
      canvasRender.renderAll();
    });
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
