import React, { useState, useEffect, useRef } from 'react';
import { fabric } from 'fabric';
import 'fabric-history';

import Canvas from '@/canvas/Canvas';
import { backgroundPro } from '@/canvas/constants/defaults';
import { Tooltip } from 'antd';
import { ChromePicker } from 'react-color';

import Header from '@/components/Header';

import withRedux from '@/libraries/withRedux';
import BackgroundPro from '@/canvas/objects/BachgroundPro';
import ToolBar from '@/components/Toolbar';
import ToolbarText from '@/components/ToolbarText';
import Panel from '@/components/Panel';
import { loadFontFamilies } from '@/canvas/utils/textUtil';

import { db } from '@/intergations/firebase';
import { collection, getDocs } from 'firebase/firestore';

import { ColorPicker } from '@/svg/index';

import Style from './Style';

window.husblizerFont = {};

function Index() {
  const [canvas, setCanvas]: any = useState();
  const [pickerVisiable, setVisible] = useState(false);
  const [color, setColor] = useState('#fff');
  const [name, setName] = useState('Name');
  const [top, setTop] = useState(0);
  const [right, setRight] = useState(0);
  const [display, setDisplay] = useState('none');
  const [width, setWidth] = useState(null);
  const [widthBg, setWidthBg] = useState(1000);
  const [heightBg, setHeightBg] = useState(1000);
  const [topText, setTopText] = useState(0);
  const [rightText, setRightText] = useState(0);
  const [displayText, setDisplayText] = useState('none');
  const colorRef = useRef(null);
  const checkColorEnd = useRef(false);
  const [fonts, setFonts] = useState([]);

  const handlePosMax = aCoords => {
    const { tr, tl, br, bl } = aCoords;
    let yMax = tr.y;
    let xMax = tr.x;

    if (-yMax < -tl.y) yMax = tl.y;
    if (-yMax < -bl.y) yMax = bl.y;
    if (-yMax < -br.y) yMax = br.y;

    if (xMax < tl.x) xMax = tl.x;
    if (xMax < bl.x) xMax = bl.x;
    if (xMax < br.x) xMax = br.x;

    return { x: xMax, y: yMax };
  };

  const checkTextBox = (canvas: any) => {
    const obj = canvas.getActiveObject();

    return obj.type === 'textBoxPro';
  };

  useEffect(() => {
    const fetchsData = async () => {
      const fontsData = [];
      const querySnapshot = await getDocs(collection(db, 'tests'));
      querySnapshot.forEach(doc => {
        fontsData.push(doc.data());
      });

      const convertData = fontsData.map(item => {
        const { name, url } = item;
        return { fontFamily: name, value: name, fontUrl: url, label: url };
      });
      setFonts(convertData);
      loadFontFamilies(convertData);
    };

    fetchsData();
  }, []);

  useEffect(() => {
    const heightToolBar = 204;
    const heightToolBarText = 144;
    const widthToolBarText = 380;
    if (!canvas) return;

    function resize() {
      canvas.setDimensions({
        width: window.innerWidth - 450,
        height: window.innerHeight,
      });
      if (canvas.width <= canvas.height) {
        canvas.setViewportTransform([
          canvas.width / widthBg - 0.15,
          0,
          0,
          canvas.width / widthBg - 0.15,
          canvas.getCenter().left,
          canvas.getCenter().top + 25,
        ]);
        canvas.requestRenderAll();
        canvas.renderAll();
      } else {
        console.log('dfvdfvdfvdfv');
        canvas.setViewportTransform([
          canvas.height / heightBg - 0.15,
          0,
          0,
          canvas.height / heightBg - 0.15,
          canvas.getCenter().left,
          canvas.getCenter().top + 25,
        ]);
        canvas.requestRenderAll();
        canvas.renderAll();
      }
      setWidth(window.innerWidth - 450);
    }
    window.addEventListener('resize', resize);

    const eventMoving = opt => {
      const { target } = opt;
      if (target.type === 'activeSelection') {
        const activeSelection = target as fabric.ActiveSelection;
        activeSelection._objects.forEach((obj: any) => {
          const left = target.left + obj.left + target.width / 2;
          const top = target.top + obj.top + target.height / 2;
          if (obj.type === 'dynamicImagePro') {
            obj._updateMask(left, top);
            return;
          }
        });
      }

      setDisplay('none');
      setDisplayText('none');
    };

    const eventMoved = (evt: any) => {
      const { target } = evt;
      const { height, width } = target;
      const { aCoords } = target;
      // const { tr, tl, br, bl } = aCoords
      const tr = handlePosMax(aCoords);
      setRight(canvas.width / 2 - tr.x * canvas.getZoom() - 80);
      setTop(
        canvas.height / 2 +
          tr.y * canvas.getZoom() +
          (height * canvas.getZoom() - heightToolBar) / 2,
      );
      setDisplay('block');

      canvas.transactionHandler.save('add');
      if (!checkTextBox(canvas)) return;

      setRightText(
        canvas.width / 2 -
          tr.x * canvas.getZoom() -
          (widthToolBarText - width * canvas.getZoom()) / 2,
      );
      setTopText(canvas.height / 2 + tr.y * canvas.getZoom() - heightToolBarText - 50);
      setDisplayText('block');
    };

    const evetnSelection = (evt: any) => {
      const { target } = evt;
      const { height, width } = target;
      const { aCoords } = target;
      // const { tr } = aCoords
      const tr = handlePosMax(aCoords);
      setRight(canvas.width / 2 - tr.x * canvas.getZoom() - 80);
      setTop(
        canvas.height / 2 +
          tr.y * canvas.getZoom() +
          (height * canvas.getZoom() - heightToolBar) / 2,
      );
      setDisplay('block');

      if (!checkTextBox(canvas)) return;

      setRightText(
        canvas.width / 2 -
          tr.x * canvas.getZoom() -
          (widthToolBarText - width * canvas.getZoom()) / 2,
      );
      setTopText(canvas.height / 2 + tr.y * canvas.getZoom() - heightToolBarText - 50);
      setDisplayText('block');
    };

    const eventScaling = opt => {
      const { target } = opt;
      if (target.type === 'activeSelection') {
        const activeSelection = target as fabric.ActiveSelection;
        const { scaleX } = target;
        activeSelection._objects.forEach((obj: any) => {
          const left = target.left + obj.left * scaleX + (target.width * scaleX) / 2;
          const top = target.top + obj.top * scaleX + (target.height * scaleX) / 2;
          if (obj.type === 'dynamicImagePro') {
            obj._updateMask(left, top, obj.width * scaleX, obj.height * scaleX);

            return;
          }
        });
      }
      setDisplay('none');
      setDisplayText('none');
    };

    const eventScaled = (evt: any) => {
      setTimeout(() => {
        const { target } = evt;
        const { height, width } = target;
        const { aCoords } = target;
        // const { tr } = aCoords
        const tr = handlePosMax(aCoords);

        setRight(canvas.width / 2 - tr.x * canvas.getZoom() - 80);
        setTop(
          canvas.height / 2 +
            tr.y * canvas.getZoom() +
            (height * canvas.getZoom() - heightToolBar) / 2,
        );
        setDisplay('block');
        canvas.transactionHandler.save('add');

        if (target.type === 'activeSelection') {
          canvas.discardActiveObject();
          var sel = new fabric.ActiveSelection(target._objects, {
            canvas,
            borderColor: '#94caef',
            dirty: true,
          });

          canvas.setActiveObject(sel);
          canvas.renderAll();
        }
        if (!checkTextBox(canvas)) return;

        setRightText(
          canvas.width / 2 -
            tr.x * canvas.getZoom() -
            (widthToolBarText - width * canvas.getZoom()) / 2,
        );
        setTopText(canvas.height / 2 + tr.y * canvas.getZoom() - heightToolBarText - 50);
        setDisplayText('block');
      });
    };

    const eventRotating = () => {
      setDisplay('none');
      setDisplayText('none');
    };

    const eventRotated = (evt: any) => {
      const { target } = evt;
      const { height, width } = target;
      const { aCoords } = target;
      // const { tr } = aCoords
      const tr = handlePosMax(aCoords);

      setRight(canvas.width / 2 - tr.x * canvas.getZoom() - 80);
      setTop(
        canvas.height / 2 +
          tr.y * canvas.getZoom() +
          (height * canvas.getZoom() - heightToolBar) / 2,
      );
      setDisplay('block');
      canvas.transactionHandler.save('add');
      if (!checkTextBox(canvas)) return;

      setRightText(
        canvas.width / 2 -
          tr.x * canvas.getZoom() -
          (widthToolBarText - width * canvas.getZoom()) / 2,
      );
      setTopText(canvas.height / 2 + tr.y * canvas.getZoom() - heightToolBarText - 50);
      setDisplayText('block');
    };

    const offSelection = () => {
      setDisplay('none');
      setDisplayText('none');
    };

    canvas.on('object:moving', eventMoving);
    canvas.on('object:moved', eventMoved);
    canvas.on('selection:created', evetnSelection);
    canvas.on('selection:updated', evetnSelection);
    canvas.on('object:scaling', eventScaling);
    canvas.on('object:scaled', eventScaled);
    canvas.on('object:rotating', eventRotating);
    canvas.on('object:rotated', eventRotated);
    canvas.on('selection:cleared', offSelection);

    const objs = [];
    objs.unshift(backgroundPro);

    canvas.loadFromJSON(
      {
        objects: objs,
      },
      canvas.renderAll.bind(canvas),
    );

    canvas.transactionHandler.initialize(objs);
    canvas.zoomHandler.wheelHandler();
    canvas.panHanler.panHandler();
  }, [canvas]);

  useEffect(() => {
    const handleClick = e => {
      if (!colorRef.current?.contains(e.target)) {
        setVisible(false);
      }
    };

    window.addEventListener('mousedown', handleClick);

    return () => window.removeEventListener('mousedown', handleClick);
  }, []);

  const handleColor = (e: any) => {
    const bgUrl =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=';

    fabric.Image.fromURL(bgUrl, (myImg: any) => {
      canvas.backgroundHandler.bgHandler(0.15, myImg, { width: widthBg, height: heightBg }, color);

      canvas.zoomHandler.zoomHandler(0.15, { width: widthBg, height: heightBg });

      checkColorEnd.current = true;
    });

    setColor(e.hex);
  };

  useEffect(() => {
    if (checkColorEnd.current) {
      canvas?.transactionHandler.save('add');
    }
  }, [checkColorEnd.current]);

  return (
    <Style
      theme={{
        width,
      }}
    >
      <div className="items__container">
        <Panel canvas={canvas} />
      </div>
      <div className="canvas__container">
        <Header
          color={color}
          canvas={canvas}
          width={widthBg}
          height={heightBg}
          setWidthBg={setWidthBg}
          setHeightBg={setHeightBg}
          setWidth={setWidth}
          name={name}
          setName={setName}
        />
        <div className="">
          <Canvas setCanvas={setCanvas} />
          <div className="canvas__fill" ref={colorRef}>
            {!pickerVisiable ? (
              <Tooltip title="Background Color" mouseLeaveDelay={0}>
                <div
                  onClick={() => {
                    setVisible(true);
                    checkColorEnd.current = false;
                  }}
                >
                  <ColorPicker />
                </div>
              </Tooltip>
            ) : (
              <ChromePicker color={color} onChange={handleColor} />
            )}
          </div>
          <ToolBar
            setDisplay={setDisplay}
            canvas={canvas}
            top={top}
            right={right}
            display={display}
          />
          <ToolbarText
            top={topText}
            right={rightText}
            display={displayText}
            canvas={canvas}
            fonts={fonts}
          />
        </div>
      </div>
    </Style>
  );
}

var windowFabric: any = window.fabric;
windowFabric.BackgroundPro = BackgroundPro;

export default withRedux(Index);
