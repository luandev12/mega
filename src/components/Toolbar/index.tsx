import React, { useState } from 'react';
import { fabric } from 'fabric';
import { FileImageOutlined } from '@ant-design/icons';
import { RemoveBgResult, RemoveBgError, removeBackgroundFromImageUrl } from 'remove.bg';
import { Button, Tooltip } from 'antd';

import Style from './Style';

import {
  Delete,
  Duplicate,
  BringForward,
  SendBackwards,
  FlipVertical,
  FlipHorizontal,
  FillArea,
} from '@/svg';
import { v4 as uuidv4 } from 'uuid';

interface Props {
  top: number;
  right: number;
  display: string;
  canvas: any;
  setDisplay: any;
}

const Index = ({ top, right, display, canvas, setDisplay }: Props) => {
  const [loading, setLoading] = useState(false);

  const handleBringForward = () => {
    const objects = canvas.getActiveObjects();
    objects.reverse().forEach(obj => {
      obj.setZIndex('forward');
      canvas.renderAll();
    });
  };

  const handleSendBackwards = () => {
    const objects = canvas.getActiveObjects();
    objects.forEach(obj => {
      obj.setZIndex('backward');
      canvas.renderAll();
    });
  };

  const handleDuplicate = () => {
    const objects = canvas.getActiveObjects();
    if (objects.length === 0) return;

    if (objects.length === 1) {
      const object = objects[0];
      switch (object.type) {
        case 'dynamicImagePro':
          object.clone(
            clone => {
              canvas.discardActiveObject();
              if (clone.clipPath) {
                fabric.util.enlivenObjects(
                  [clone.clipPath],
                  function(arg1) {
                    clone.clipPath = arg1[0];
                  },
                  '',
                );
              }
              clone.set({
                left: clone.left + 10,
                top: clone.top + 10,
                id: uuidv4(),
                name: clone.name + ' (cloned)',
              });
              canvas.add(clone);
              canvas.bringToFront(clone);
              canvas.setActiveObject(clone);
            },
            ['id', 'componentType', 'shape'],
          );
          break;
        case 'textBoxPro':
          object.cloneObject();
          break;
        default:
          break;
      }
    } else {
      const cloneObjs = [];
      objects.forEach(object => {
        switch (object.type) {
          case 'dynamicImagePro':
            object.clone(
              clone => {
                canvas.discardActiveObject();
                if (clone.clipPath) {
                  fabric.util.enlivenObjects(
                    [clone.clipPath],
                    function(arg1) {
                      clone.clipPath = arg1[0];
                    },
                    '',
                  );
                }
                clone.set({
                  left: clone.left + 10,
                  top: clone.top + 10,
                  id: uuidv4(),
                  name: clone.name + ' (cloned)',
                });
                cloneObjs.push(clone);
                canvas.add(clone);
              },
              ['id', 'componentType', 'shape'],
            );

            canvas.renderAll();

            break;

          case 'textBoxPro':
            object.clone(
              clone => {
                clone.set({
                  left: clone.left + 10,
                  top: clone.top + 10,
                  id: uuidv4(),
                  name: clone.name + ' (cloned)',
                });
                cloneObjs.push(clone);
                canvas.add(clone);
              },
              ['id', 'componentType', 'shape'],
            );

            break;
          default:
            break;
        }
      });
      var sel = new fabric.ActiveSelection(cloneObjs, {
        canvas: canvas,
        borderColor: '#a8c0e4',
        dirty: true,
      });
      canvas.discardActiveObject();
      canvas.setActiveObject(sel);
    }
  };

  const handleDelete = () => {
    const objectActive = canvas.getActiveObjects();

    canvas.remove.apply(canvas, objectActive);
    canvas.discardActiveObject();
    canvas.renderAll();
    setDisplay('none');
  };

  const handleRemoveBG = () => {
    const objects = canvas.getActiveObject();

    if (objects.type === 'dynamicImagePro') {
      const type = objects?.src?.split('.')[5]?.split('?')[0] || 'png';

      setLoading(true);

      removeBackgroundFromImageUrl({
        url: objects.src,
        apiKey: 'kvWWAyTp9WoYbRBXKXzxnHcu',
        size: 'auto',
        type: 'auto',
      })
        .then((result: RemoveBgResult) => {
          const base64img = result.base64img;
          const dataUrl = `data:image/${type};base64,${base64img}`;

          function b64toBlob(b64, onsuccess, onerror) {
            var img = new Image();
            img.onerror = onerror;
            img.onload = function onload() {
              var canvas = document.createElement('canvas');
              canvas.width = img.width;
              canvas.height = img.height;

              var ctx = canvas.getContext('2d');
              ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

              canvas.toBlob(onsuccess);
            };

            img.src = b64;
          }

          b64toBlob(
            dataUrl,
            blob => {
              var url = window.URL.createObjectURL(blob);
              const activeObj = canvas?.getActiveObject();
              activeObj.dynamicImage(url);

              console.log(url, 'url');
              setLoading(false);
            },
            error => {},
          );
        })
        .catch((errors: Array<RemoveBgError>) => {
          setLoading(false);
          console.log(JSON.stringify(errors));
        });
    }

    canvas.renderAll();
  };

  const handleFlipVertical = () => {
    const objectActives = canvas.getActiveObjects();
    objectActives.forEach(obj => {
      obj.item(0).flipY = !obj.item(0).flipY;
    });
    canvas.renderAll();
  };

  const handleFlipHorizontal = () => {
    const objectActives = canvas.getActiveObjects();
    objectActives.forEach(obj => {
      obj.item(0).flipX = !obj.item(0).flipX;
    });
    canvas.renderAll();
  };

  const handleFillArea = () => {
    const objectActives = canvas.getActiveObjects();

    objectActives.forEach(obj => {
      if (obj.type !== 'dynamicImagePro') return;

      obj.setFillArea(!obj.fillArea);
    });
  };

  return (
    <Style
      theme={{
        top,
        right,
        display,
      }}
    >
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
      <div onClick={handleFillArea} className="wrap__icon">
        <FillArea />
      </div>
      <div onClick={handleRemoveBG} className="wrap__icon my-2">
        <Tooltip zIndex={99999999} placement="topLeft" title="Remove background">
          <Button
            loading={loading}
            icon={<FileImageOutlined style={{ backgroundColor: '#fff' }} color="#fff" />}
          ></Button>
        </Tooltip>
      </div>
    </Style>
  );
};

export default Index;
