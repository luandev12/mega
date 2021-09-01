import React, { useRef, useEffect } from 'react';
import { fabric } from 'fabric';

import Style from './Style';

interface Props {
  children?: any;
  setCanvas: any;
}

export default function Canvas({ setCanvas, children }: Props) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      renderOnAddRemove: true,
      allowTouchScrolling: true,
      preserveObjectStacking: true,
    });

    setCanvas(canvas);

    canvas.setWidth(window.innerWidth - 240 * 2);
    canvas.setHeight(window.innerHeight);

    return () => {
      canvas.dispose();
    };
  }, [setCanvas]);

  return (
    <Style>
      <canvas id="canvas-editor" ref={canvasRef}></canvas>
      {children}
    </Style>
  );
}
