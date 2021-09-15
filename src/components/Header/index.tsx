import React from 'react';
import { fabric } from 'fabric';
import { useFormik } from 'formik';

import { getBlobFromUrl } from '@/ultis/index';

import { Undo, Redo, MoouseHand } from '@/svg/index';

import Style from './Style';

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
    const objRender = canvas?.getObjects().map(async obj => {
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
      canvas?.setDimensions({
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
        canvas?.setBackgroundImage(myImg, canvas?.renderAll.bind(canvas));

        if (canvas?.width <= canvas?.height) {
          canvas?.setViewportTransform([
            canvas?.width / width - 0.15,
            0,
            0,
            canvas?.width / width - 0.15,
            canvas?.getCenter().left,
            canvas?.getCenter().top + 25,
          ]);

          canvas?.requestRenderAll();
          canvas?.renderAll();
        } else {
          canvas?.setViewportTransform([
            canvas?.height / height - 0.15,
            0,
            0,
            canvas?.height / height - 0.15,
            canvas?.getCenter().left,
            canvas?.getCenter().top + 25,
          ]);

          canvas?.requestRenderAll();
          canvas?.renderAll();
        }

        let scaleX = canvas?.getWidth() / width;
        const scaleY = canvas?.getHeight() / height;
        if (height >= width) {
          scaleX = scaleY;
          if (canvas?.getWidth() < width * scaleX) {
            scaleX = scaleX * (canvas?.getWidth() / (width * scaleX));
          }
        } else {
          if (canvas?.getHeight() < height * scaleX) {
            scaleX = scaleX * (canvas?.getHeight() / (height * scaleX));
          }
        }
        const center = canvas?.getCenter();

        canvas?.zoomToPoint(new fabric.Point(center.left, center.top), scaleX - 0.15);
        canvas?.requestRenderAll();
        canvas?.renderAll();
      });
    },
  });

  const handlePan = () => {
    if (canvas && canvas?.defaultCursor !== 'grab') {
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
            <span onClick={() => canvas?.undo()} className="your-hand">
              <Undo />
            </span>
            <span onClick={() => canvas.redo()} className="your-hand">
              <Redo />
            </span>
            <span onClick={handlePan} className="mouse-hand">
              <MoouseHand />
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
