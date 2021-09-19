import React, { useRef, useEffect } from 'react';
import { fabric } from 'fabric';

import Transaction from '@/canvas/handles/TransactionHandler';
import ZoomHandler from '@/canvas/handles/ZoomHandler';
import PanHandler from '@/canvas/handles/PanHandler';

import Style from './Style';

interface Props {
  children?: any;
  setCanvas?: any;
}

export default function Canvas({ setCanvas, children }: Props) {
  const canvasRef: any = useRef(null);

  useEffect(() => {
    const canvas: any = new fabric.Canvas('canvas-editor', {
      renderOnAddRemove: true,
      allowTouchScrolling: true,
      preserveObjectStacking: true,
      uniScaleKey: null,
      centeredKey: 'shiftKey',
      altActionKey: null,
    });

    canvas.setWidth(canvasRef.current.clientWidth);
    canvas.setHeight(canvasRef.current.clientHeight);

    const transaction = new Transaction(canvas);
    const zoom = new ZoomHandler(canvas);
    const pan = new PanHandler(canvas);

    canvas.transactionHandler = transaction;
    canvas.zoomHandler = zoom;
    canvas.panHanler = pan;

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
