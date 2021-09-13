import React, { useState, useEffect } from 'react';
import { Input, InputNumber } from 'antd'

import { RightCenter, LeftAlign, CenterAlign } from '@/svg'

import Style from './Style'

interface Props {
  top: number;
  right: number;
  display: string;
  canvas: any;
}

const Index = ({ top, right, display, canvas }: Props) => {
  const [color, setColor] = useState('#000')
  const [size, setSize] = useState(0)
  const [align, setAlign] = useState('center')

  const handleColor = (e: any) => {
    canvas.getActiveObject().updateColor('fill', e.target.value)
    setColor(e.target.value)
  }

  useEffect(() => {
    const obj = canvas?.getActiveObject()
    if (!obj) return
    
    setColor(obj.item(0).fill.substring(0, 7))
    setSize(obj.maxSize)
    setSize(obj.textAlign)
  }, [canvas?.getActiveObject()])

  const handleText = (e: any) => {
    canvas.getActiveObject().setText(e.target.value, '')
  }

  const handleFontSize = (value: any) => {
    console.log(parseInt(value, 10))
    
    canvas.getActiveObject().updateCalcPostion('maxSize', value)
    setSize(value)
  }

  const handleTextAlign = (value: string) => {
    const obj = canvas?.getActiveObject()
    setAlign(value)
    obj.setTextAlign(value)
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
      <div className="text__bottom">
        <InputNumber value={size} onChange={handleFontSize} />
        <div className="text__align">
          <div onClick={() => handleTextAlign('left')} className={`${align === 'left' ? 'active' : ''}`}>
            <LeftAlign />
          </div>
          <div onClick={() => handleTextAlign('center')} className={`${align === 'center' ? 'active' : ''}`}>
            <CenterAlign />
          </div>
          <div onClick={() => handleTextAlign('right')} className={`${align === 'right' ? 'active' : ''}`}>
            <RightCenter />
          </div>
        </div>
      </div>
    </Style>
  );
}

export default Index;
