import React from "react";
import Data from '@/canvas/utils/InitialsLayer.json';
import CirclePro from '@/canvas/objects/Circle';
import RectPro from '@/canvas/objects/Rect';
import { v4 } from 'uuid';
import Style from "./Style";

const Index = ({ canvas }) => {

  const addCircle = () => {
    const initCircle = Data.Layers[4];
    const newCirclePro = new CirclePro({ ...initCircle, id: v4() });
    canvas.add(newCirclePro)
    canvas.setActiveObject(newCirclePro);
    canvas.renderAll();
  }

  const addRect = () => {
    const initRect = Data.Layers[5];
    const newRectPro = new RectPro({ ...initRect, id: v4() });
    canvas.add(newRectPro)
    canvas.setActiveObject(newRectPro);
    canvas.renderAll();
  }

  return (
    <Style>
      <div className="circle" onClick={addCircle} />
      <div className="rect" onClick={addRect} />
    </Style>
  )
}

export default Index