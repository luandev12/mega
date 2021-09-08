import React, {} from 'react'
import { fabric } from "fabric";

import Style from './Style'

import { Delete, Duplicate, BringForward, SendBackwards, FlipVertical, FlipHorizontal } from '@/svg'
import { v4 as uuidv4 } from 'uuid'

interface Props {
  top: number;
  right: number;
  display: string;
  canvas: any;
  setDisplay: any;
}

const Index = ({ top, right, display, canvas, setDisplay }: Props) => {

  const handleBringForward = () => {
    const objects = canvas.getActiveObjects()
    objects.reverse().forEach(obj => {
      obj.setZIndex('forward')
      canvas.renderAll()
    })
  }

  const handleSendBackwards = () => {
    const objects = canvas.getActiveObjects()
    objects.forEach(obj => {
      obj.setZIndex('backward')
      canvas.renderAll()
    })
  }

  const handleDuplicate = () => {
    const objects = canvas.getActiveObjects()
    if (objects.length === 0) return

    if (objects.length === 1) {
      const object = objects[0]
      switch (object.type) {
        case 'dynamicImagePro':
          objects.clone(
            (clone) => {
              canvas.discardActiveObject();
              if (clone.clipPath) {
                fabric.util.enlivenObjects([clone.clipPath], function(arg1) {
                  clone.clipPath = arg1[0];
                },"")
              }
              clone.set({
                left: clone.left + 10,
                top: clone.top + 10,
                id: uuidv4(),
                name: clone.name + " (cloned)"
              });
              canvas.add(clone);
              canvas.bringToFront(clone);
              canvas.setActiveObject(clone);
            },
            ['id', 'componentType', 'shape'],
          )
          break;
        default: break
      }
    } else {
      
      const cloneObjs = []
      objects.forEach((object) => {
        switch (object.type) {
          case 'dynamicImagePro':
            object.clone(
              (clone) => {
                canvas.discardActiveObject()
                if (clone.clipPath) {
                  fabric.util.enlivenObjects([clone.clipPath], function(arg1) {
                    clone.clipPath = arg1[0];
                  },"")
                }
                clone.set({
                  left: clone.left + 10,
                  top: clone.top + 10,
                  id: uuidv4(),
                  name: clone.name + " (cloned)"
                });
                cloneObjs.push(clone)
                canvas.add(clone);
              },
              ['id', 'componentType', 'shape'],
            );
        
            canvas.renderAll();
    
            break
          default:
            break
        }
      })
      var sel = new fabric.ActiveSelection(cloneObjs, {
        canvas: canvas,
        borderColor: '#a8c0e4',
        dirty: true
      });
      canvas.discardActiveObject()
      canvas.setActiveObject(sel)

    }
  }

  const handleDelete = () => {
    const objectActive = canvas.getActiveObjects()
    
    canvas.remove.apply(canvas, objectActive)
    canvas.discardActiveObject()
    canvas.renderAll()
    setDisplay('none')
  }

  const handleFlipVertical = () => {
    const objectActives = canvas.getActiveObjects()
    objectActives.forEach(obj => {
      obj.item(0).flipY = !obj.item(0).flipY
    })
    canvas.renderAll()
  }

  const handleFlipHorizontal = () => {
    const objectActives = canvas.getActiveObjects()
    objectActives.forEach(obj => {
      obj.item(0).flipX = !obj.item(0).flipX
    })
    canvas.renderAll()
  }

  return (
    <Style theme={{
      top,
      right,
      display
    }}>
      <div onClick={handleFlipHorizontal} className="wrap__icon">
        <FlipHorizontal />
      </div>
      <div onClick={handleFlipVertical} className="wrap__icon">
        <FlipVertical />
      </div>
      <div onClick={handleBringForward} className="wrap__icon">
        <BringForward />
      </div>
      <div onClick={handleSendBackwards} className="wrap__icon">
        <SendBackwards />
      </div>
      <div onClick={handleDuplicate} className="wrap__icon">
        <Duplicate />
      </div>
      <div onClick={handleDelete} className="wrap__icon">
        <Delete />
      </div>
    </Style>
  );
}

export default Index
