import React, { useRef, useEffect } from 'react';
import { fabric } from 'fabric';

import Transaction from '@/canvas/handles/TransactionHandler';
import ZoomHandler from '@/canvas/handles/ZoomHandler';
import PanHandler from '@/canvas/handles/PanHandler';
import BackgroundHandler from '@/canvas/handles/BackgroundHandler';

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
    const background = new BackgroundHandler(canvas);

    canvas.transactionHandler = transaction;
    canvas.zoomHandler = zoom;
    canvas.panHanler = pan;
    canvas.backgroundHandler = background;

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
