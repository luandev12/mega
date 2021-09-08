import React, { useRef, useEffect } from 'react';
import { fabric } from 'fabric';

import Style from './Style';

interface Props {
  children?: any;
  setCanvas?: any;
}

export default function Canvas({ setCanvas, children }: Props) {
  const canvasRef: any = useRef(null);

  useEffect(() => {

    const canvas = new fabric.Canvas("canvas-editor", {
      renderOnAddRemove: true,
      allowTouchScrolling: true,
      preserveObjectStacking: true,
      uniScaleKey: null,
      centeredKey: 'shiftKey',
      altActionKey: null
    });

    canvas.setWidth(canvasRef.current.clientWidth);
    canvas.setHeight(canvasRef.current.clientHeight);
    
    setCanvas(canvas);

    return () => {
      canvas.dispose();
    };
  }, [setCanvas]);

  return (
    <Style ref={canvasRef}>
      <canvas id="canvas-editor"></canvas>
      {children}
    </Style>
  );
}
