import React, { useState, useEffect } from 'react';
import { Input } from 'antd'
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
    canvas.getActiveObject().updateColor('fill', e.target.value)
    setColor(e.target.value)
  }

  useEffect(() => {
    const obj = canvas?.getActiveObject()
    if (!obj) return
    
    setColor(obj.item(0).fill.substring(0, 7))
  }, [canvas?.getActiveObject()])

  const handleText = (e: any) => {
    canvas.getActiveObject().setText(e.target.value, '')
  }

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
        <Input onChange={handleText} />
      </div>
    </Style>
  );
}

export default Index;
