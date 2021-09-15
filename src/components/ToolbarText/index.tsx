import React, { useState, useEffect } from 'react';
import { Input, InputNumber, Select } from 'antd'

import { RightCenter, LeftAlign, CenterAlign } from '@/svg'

import Style from './Style'

interface Props {
  top: number;
  right: number;
  display: string;
  canvas: any;
  fonts: any;
}

const { Option } = Select;

const Index = ({ top, right, display, canvas, fonts }: Props) => {
  const [color, setColor] = useState('#000')
  const [size, setSize] = useState(0)
  const [align, setAlign] = useState('center')
  const [fontFamily, setFontFamily] = useState('')
  const [text, setText] = useState('')
  const handleColor = (e: any) => {
    canvas.getActiveObject().updateColor('fill', e.target.value)
    setColor(e.target.value)
  }
  
  const handleFontName = (name) => {
    if (name[0] === "'") {
      return name.substring(1, name.length - 1)
    }

    return name
  }

  useEffect(() => {
    const obj = canvas?.getActiveObject()
    if (!obj || obj?.type !== 'textBoxPro') return
    
    setColor(obj.item(0).fill.substring(0, 7))
    setSize(obj.maxSize)
    setAlign(obj.item(0).textAlign)
    setFontFamily(handleFontName(obj.item(0).fontFamily))
    setText(obj.originalText)
  }, [canvas?.getActiveObject()])

  const handleText = (e: any) => {
    const { value } = e.target
    setText(value)
    canvas.getActiveObject().setText(value, '')
  }

  const handleFontSize = (value: any) => {
    
    canvas.getActiveObject().updateCalcPostion('maxSize', value)
    setSize(value)
  }

  const handleTextAlign = (value: string) => {
    const obj = canvas?.getActiveObject()
    setAlign(value)
    obj.setTextAlign(value)
  }

  const handleFont = (value) => {
    const obj = canvas?.getActiveObject()
    setFontFamily(handleFontName(value))
    obj.setFontFamily(value)
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
        <div>
          <Select
            style={{ width: '200px' }}
            value={fontFamily}
            onChange={handleFont}
          >
            {fonts.map((font: any) => {

              return (
                <Option value={font.fontFamily}>
                  {font.fontFamily}
                </Option>
              )
            })}
          </Select>
        </div>
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
      <div
        style={{
          marginTop: '10px'
        }}
      >
        <Input value={text} onChange={handleText} />
      </div>
    </Style>
  );
}

export default Index;
