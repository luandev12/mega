import React, { useState, useEffect } from 'react';

import Style from './Style'

interface Props {
  top: number;
  right: number;
  display: string;
  canvas: any;
}

const Index = ({ top, right, display, canvas }: Props) => {
  const [color, setColor] = useState('#000')
  const handleColor = (e: any) => {
    canvas.getActiveObject().set('fill', e.target.value)
    canvas.renderAll()
    setColor(e.target.value)
  }

  useEffect(() => {
    const obj = canvas?.getActiveObject()
    if (!obj) return
    
    setColor(obj?.fill)
  }, [canvas?.getActiveObject()])

  return (
    <Style
      theme={{
        top,
        right,
        display,
      }}
    >
      <div className="text__top">
        <input onChange={handleColor} type="color" value={color} />
      </div>
    </Style>
  );
}

export default Index;
