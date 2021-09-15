import React, { useState } from 'react';
import { fabric } from 'fabric';
import { useFormik } from 'formik';

import Style from './Style';

import { getBlobFromUrl } from '@/ultis/index';

interface Props {
  canvas: any;
  color: string;
  height: any;
  width: any;
  setWidthBg: any;
  setHeightBg: any;
  setWidth: any;
}

export default function index({ canvas, color, height, width, setWidthBg, setHeightBg }: Props) {
  const exportPng = async () => {
    const objRender = canvas.getObjects().map(async obj => {
      const item = { ...obj.toJSON() };

      if (item.type === 'backgroundPro') {
        item.fill = color;
        item.height = height;
        item.width = width;
      }

      if (item.src) {
        const src: any = await getBlobFromUrl(item.src);
        item.src = src;
      }

      item.typeRender = true;
      return item;
    });

    const canvasRender = new fabric.Canvas(null, {});

    canvasRender.width = width;
    canvasRender.height = height;

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

  const formik = useFormik({
    initialValues: { width, height },
    onSubmit: async () => {
      canvas.setDimensions({
        width: window.innerWidth - 450,
        height: window.innerHeight,
      });

      const bgUrl =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=';
      fabric.Image.fromURL(bgUrl, (myImg: any) => {
        myImg.set({
          originX: 'center',
          originY: 'center',
          width,
          height,
          crossOrigin: 'anonymous',
          backgroundColor: color,
        });
        var filter = new fabric.Image.filters.BlendColor({
          color: color,
          mode: 'tint',
        });
        myImg.filters.push(filter);
        myImg.applyFilters();
        canvas.setBackgroundImage(myImg, canvas.renderAll.bind(canvas));

        if (canvas.width <= canvas.height) {
          canvas.setViewportTransform([
            canvas.width / width - 0.15,
            0,
            0,
            canvas.width / width - 0.15,
            canvas.getCenter().left,
            canvas.getCenter().top + 25,
          ]);

          canvas.zoomToPoint(
            new fabric.Point(canvas.getCenter().left, canvas.getCenter().top),
            width <= height ? width / height - 0.15 : height / width - 0.15,
          );

          canvas.requestRenderAll();
          canvas.renderAll();
        } else {
          canvas.setViewportTransform([
            canvas.height / height - 0.15,
            0,
            0,
            canvas.height / height - 0.15,
            canvas.getCenter().left,
            canvas.getCenter().top + 25,
          ]);

          canvas.zoomToPoint(
            new fabric.Point(canvas.getCenter().left, canvas.getCenter().top),
            width >= height ? canvas.height / height - 0.15 : canvas.height / width - 0.2,
          );
          canvas.requestRenderAll();
          canvas.renderAll();
        }
      });
    },
  });

  const handlePan = () => {
    if (canvas && canvas.defaultCursor !== 'grab') {
      canvas.defaultCursor = 'grab';
      canvas.renderAll();
    } else {
      canvas.defaultCursor = 'default';
      canvas.renderAll();
    }
  };

  return (
    <Style>
      <div className="d-flex justify-content-between align-items-center mr-3">
        <div className="d-flex">
          <span className="tool-icon">
            <span onClick={handlePan} className="mouse-hand">
              <svg
                className="svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.026 12.382c-.518-.487-.57-1.308-.118-1.856.435-.527 1.191-.62 1.74-.216l1.347.996 1 .739V4c0-.552.448-1 1-1 .553 0 1 .448 1 1v5h1V2c0-.552.448-1 1-1 .553 0 1 .448 1 1v7h1V3c0-.552.448-1 1-1 .553 0 1 .448 1 1v6h1V6c0-.552.448-1 1-1 .553 0 1 .448 1 1v8c0 2.762-2.238 5-5 5h-1c-1.553 0-2.94-.708-3.858-1.82-.036-.028-.071-.06-.106-.092l-5.005-4.706zm4.4 5.507l-.08-.072-5.005-4.706c-.902-.848-.993-2.267-.204-3.221.772-.936 2.127-1.106 3.105-.384l.753.557V4c0-1.104.896-2 2-2 .365 0 .706.097 1 .268V2c0-1.105.896-2 2-2 .873 0 1.615.559 1.888 1.338.318-.214.7-.338 1.112-.338 1.105 0 2 .895 2 2v1.268c.295-.17.636-.268 1-.268 1.105 0 2 .896 2 2v8c0 3.314-2.686 6-6 6h-1c-1.83 0-3.47-.821-4.57-2.111z"
                  fill-rule="evenodd"
                  fill-opacity="1"
                  fill="#fff"
                  stroke="none"
                ></path>
              </svg>
            </span>
          </span>
        </div>
        <form className="" onSubmit={formik.handleSubmit}>
          <div className="d-flex align-items-center">
            <input
              type="text"
              className="form-control"
              style={{ width: '60px', height: '30px', border: 'none', textAlign: 'center' }}
              id="width"
              name="width"
              value={width}
              onChange={e => {
                const v = parseFloat(e.target.value);
                formik.setFieldValue('width', v);
                setWidthBg(v);
              }}
            />
            <div className="mx-3">x</div>
            <input
              type="text"
              className="form-control"
              style={{
                width: '60px',
                height: '30px',
                border: 'none',
                textAlign: 'center',
                marginRight: '20px',
              }}
              value={height}
              onChange={e => {
                const v = parseFloat(e.target.value);
                formik.setFieldValue('height', v);
                setHeightBg(v);
              }}
              id="height"
              name="height"
            />

            <button
              type="submit"
              style={{ color: '#fff', border: 'none', background: 'transparent' }}
              className=""
            >
              Save
            </button>
          </div>
        </form>
        <div className="header-export" onClick={exportPng}>
          Export
        </div>
      </div>
    </Style>
  );
}
