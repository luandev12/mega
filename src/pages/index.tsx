import React, { useState, useEffect, useRef } from 'react';
import { fabric } from 'fabric';

import Canvas from '@/canvas/Canvas';
import { backgroundPro } from '@/canvas/constants/defaults'
import { Tooltip } from 'antd'
import { ChromePicker } from 'react-color'

import withRedux from '@/libraries/withRedux';
import BackgroundPro from '@/canvas/objects/BachgroundPro'
import ToolBar from '@/components/Toolbar'


import Models from './models'

import styles from './index.css'

function Index() {
  const [canvas, setCanvas]: any = useState();
  const [pickerVisiable, setVisible] = useState(false)
  const [color, setColor] = useState('#fff')
  const [top, setTop] = useState(0)
  const [right, setRight] = useState(0)
  const [display, setDisplay] = useState('none')
  const colorRef = useRef(null)

  const handlePosMax = (aCoords) => {
    const { tr, tl, br, bl } = aCoords
    let yMax = tr.y
    let xMax = tr.x

    if (-yMax < -tl.y) yMax = tl.y
    if (-yMax < -bl.y) yMax = bl.y
    if (-yMax < -br.y) yMax = br.y

    if (xMax < tl.x) xMax = tl.x
    if (xMax < bl.x) xMax = bl.x
    if (xMax < br.x) xMax = br.x

    return { x: xMax, y: yMax }
  }

  useEffect(() => {
    const heightToolBar = 330
    if (!canvas) return

    const eventMoving = () => {

     setDisplay('none')
    }

    const eventMoved = (evt: any) => {
      const { target } = evt
      const { height } = target
      const { aCoords } = target
      // const { tr, tl, br, bl } = aCoords
      const tr = handlePosMax(aCoords)

      console.log(aCoords, 'aCoords')

      setRight(canvas.width / 2 - tr.x * canvas.getZoom() - 80)
      setTop(canvas.height / 2 + tr.y * canvas.getZoom() + (height * canvas.getZoom() - heightToolBar) / 2)
      setDisplay('block')
    }

    const evetnSelection = (evt: any) => {
      const { target } = evt
      const { height } = target
      const { aCoords } = target
      // const { tr } = aCoords
      const tr = handlePosMax(aCoords)
      setRight(canvas.width / 2 - tr.x * canvas.getZoom() - 80)
      setTop(canvas.height / 2 + tr.y * canvas.getZoom() + (height * canvas.getZoom() - heightToolBar) / 2)
      setDisplay('block')
    }

    const eventScaling = () => {
      setDisplay('none')
    }

    const eventScaled = (evt: any) => {
      setTimeout(() => {
        const { target } = evt
        const { height } = target
        const { aCoords } = target
        // const { tr } = aCoords
        const tr = handlePosMax(aCoords)
  
        setRight(canvas.width / 2 - tr.x * canvas.getZoom() - 80)
        setTop(canvas.height / 2 + tr.y * canvas.getZoom() + (height * canvas.getZoom() - heightToolBar) / 2)
        setDisplay('block')
      })
    }

    const eventRotating = () => {
      setDisplay('none')
    }

    const eventRotated = (evt: any) => {
      const { target } = evt
      const { height } = target
      const { aCoords } = target
      // const { tr } = aCoords
      const tr = handlePosMax(aCoords)

      setRight(canvas.width / 2 - tr.x * canvas.getZoom() - 80)
      setTop(canvas.height / 2 + tr.y * canvas.getZoom() + (height * canvas.getZoom() - heightToolBar) / 2)
      setDisplay('block')
    }

    canvas.on('object:moving', eventMoving)

    canvas.on('object:moved', eventMoved)

    canvas.on('selection:created', evetnSelection)

    canvas.on('selection:updated', evetnSelection)

    canvas.on('object:scaling', eventScaling)

    canvas.on('object:scaled', eventScaled)

    canvas.on('object:rotating', eventRotating)

    canvas.on('object:rotated', eventRotated)

    const objs = []
    objs.unshift(backgroundPro)
    canvas.loadFromJSON({
      objects: objs,
    }, canvas.renderAll.bind(canvas))

  }, [canvas])

  useEffect(() => {

    const handleClick = (e) => {
      if (!colorRef.current?.contains(e.target)) {
        setVisible(false)
      }
    }

    window.addEventListener('mousedown', handleClick)

    return () => window.removeEventListener('mousedown', handleClick)
  }, [pickerVisiable])

  useEffect(() => {
    
    const resize = () => {

    }

    window.addEventListener('resize', resize)
    
    return window.removeEventListener('resize', resize)
  }, [])

  const handleColor = (e: any) => {
    const bgUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII="
    fabric.Image.fromURL(
      bgUrl,
      (myImg: any) => {
        myImg.set({
          originX: 'center',
          originY: 'center',
          width: 1000,
          height: 1000,
          crossOrigin: 'anonymous',
          backgroundColor: e.hex,
        });
        var filter = new fabric.Image.filters.BlendColor({
          color: e.hex,
          mode: 'tint',
        });
        myImg.filters.push(filter);
        myImg.applyFilters();
        canvas.setBackgroundImage(myImg, canvas.renderAll.bind(canvas));

        if (canvas.width <= canvas.height) {
          canvas.setViewportTransform([
            canvas.width / myImg.width - 0.1,
            0,
            0,
            canvas.width / myImg.width - 0.1,
            canvas.getCenter().left,
            canvas.getCenter().top,
          ]);
          canvas.requestRenderAll();
          canvas.renderAll();
        } else {
          canvas.setViewportTransform([
            canvas.height / myImg.height - 0.1,
            0,
            0,
            canvas.height / myImg.height - 0.1,
            canvas.getCenter().left,
            canvas.getCenter().top,
          ]);
          canvas.requestRenderAll();
          canvas.renderAll();
        }
      }
    )
    setColor(e.hex)
  }

  return (
    <div
      className={styles.page__container}
    >
      <div className={styles.items__container}>
        <Models canvas={canvas} />
      </div>
      <div
        className={styles.canvas__container}
      >
        <Canvas setCanvas={setCanvas} />
          <div className={styles.canvas__fill} ref={colorRef}>
            {!pickerVisiable ? (
              <Tooltip
                title="Background Color"
                mouseLeaveDelay={0}
              >
                <div onClick={() => setVisible(true)}>
                  <svg width="30px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" fill="currentColor" id="colorpicker">
                    <path d="M9 0C4.03 0 0 4.03 0 9C0 13.97 4.03 18 9 18C9.83 18 10.5 17.33 10.5 16.5C10.5 16.11 10.35 15.76 10.11 15.49C9.88 15.23 9.73 14.88 9.73 14.5C9.73 13.67 10.4 13 11.23 13H13C15.76 13 18 10.76 18 8C18 3.58 13.97 0 9 0ZM3.5 9C2.67 9 2 8.33 2 7.5C2 6.67 2.67 6 3.5 6C4.33 6 5 6.67 5 7.5C5 8.33 4.33 9 3.5 9ZM6.5 5C5.67 5 5 4.33 5 3.5C5 2.67 5.67 2 6.5 2C7.33 2 8 2.67 8 3.5C8 4.33 7.33 5 6.5 5ZM11.5 5C10.67 5 10 4.33 10 3.5C10 2.67 10.67 2 11.5 2C12.33 2 13 2.67 13 3.5C13 4.33 12.33 5 11.5 5ZM14.5 9C13.67 9 13 8.33 13 7.5C13 6.67 13.67 6 14.5 6C15.33 6 16 6.67 16 7.5C16 8.33 15.33 9 14.5 9Z" fill="#fff" />
                  </svg>
                </div>
              </Tooltip>
            ) : (
              <ChromePicker
                color={color}
                onChange={handleColor}
              />
            )}
          </div>
          <ToolBar top={top} right={right} display={display} />
      </div>
    </div>
  );
}

var windowFabric: any = window.fabric;
windowFabric.BackgroundPro = BackgroundPro;

export default withRedux(Index);
