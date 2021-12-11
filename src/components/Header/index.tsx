import React, { useState } from 'react';
import { fabric } from 'fabric';
import { useFormik } from 'formik';
import { useSelector, useDispatch } from 'react-redux'

import { getBlobFromUrl } from '@/ultis/index';

import { Undo, Redo, MoouseHand } from '@/svg/index';

import { logOut, auth, db } from '../../intergations/firebase'
import { doc, setDoc, collection, query, where, getDocs } from "firebase/firestore"; 
import { v4 } from 'uuid'

import Auth from '../Auth'

import Style from './Style';
import { message } from 'antd';
import { useHistory } from 'react-router';

interface Props {
  canvas: any;
  color: string;
  height: any;
  width: any;
  setWidthBg: any;
  setHeightBg: any;
  setWidth: any;
  name: any;
  setName: any;
}

export default function index({ canvas, color, height, width, setWidthBg, setHeightBg, name, setName }: Props) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const history = useHistory()
  const userID = useSelector((state: any) => state.user)

  const exportPng = async () => {
    const objRender = canvas?.getObjects().map(async obj => {
      const item = { ...obj.toJSON() };

      if (item.type === 'backgroundPro') {
        item.fill = color;
        item.height = height;
        item.width = width;
      }

      if (item.src) {
        const src: any = await getBlobFromUrl(item.src);
        item.src = src;
      }

      item.typeRender = true;
      return item;
    });
    const canvasRender = new fabric.Canvas(null, {});
    
    canvasRender.width = width;
    canvasRender.height = height;
    
    Promise.all(objRender).then(data => {
      console.log(data)
      canvasRender?.loadFromJSON(
        {
          objects: data,
        },
        canvasRender?.renderAll.bind(canvasRender),
      );

      canvasRender?.renderAll.bind(canvasRender);
      canvasRender?.renderAll();
    });
  };

  const formik = useFormik({
    initialValues: { width, height, name },
    onSubmit: async () => {
      canvas?.setDimensions({
        width: window.innerWidth - 450,
        height: window.innerHeight,
      });

      const bgUrl =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=';

      fabric.Image.fromURL(bgUrl, (myImg: any) => {
        canvas.backgroundHandler.bgHandler(0.15, myImg, { width, height }, color);

        canvas.zoomHandler.zoomHandler(0.15, { width, height });
      });
    },
  });

  const handlePan = () => {
    if (canvas && canvas?.defaultCursor !== 'grab') {
      canvas.defaultCursor = 'grab';
      canvas.renderAll();
    } else {
      canvas.defaultCursor = 'default';
      canvas.renderAll();
    }
  };

  const checkPermission = () => {
    if (window.location.pathname === "/") return false

    return !auth?.currentUser?.uid || userID !== auth.currentUser.uid 
  }

  const handleSave = async () => {
    if (checkPermission()) {
      message.error('You haven\'t permission')

      return
    }
    try {
      const objs = canvas.getObjects().filter((item) => item.id && item.id !== 'workarea');
      let uuid
      if (window.location.pathname === "/") {
        uuid = v4()
      } else {
        uuid = window.location.pathname.split("/")[2]
      }
      await setDoc(doc(db, "documents", uuid), {
        canvas: JSON.stringify(objs),
        width,
        height,
        color,
        name,
        userId: auth?.currentUser?.uid,
      })

      // const docsData = [];

      // const q = query(
      //   collection(db, 'documents'),
      //   where('userId', '==', auth?.currentUser?.uid),
      // );

      // const docsSnap = await getDocs(q);

      // docsSnap.forEach(doc => {
      //   docsData.push({ id: doc.id, ...doc.data() });
      // });

      // dispatch(getDocuments(docsData))

      message.success('Save success')
      history.push(`/vector/${uuid}`)
    } catch (error) {
      console.log(error, 'error')
    }
  }

  return (
    <Style>
      <div className="d-flex justify-content-between align-items-center mr-3">
        <div className="d-flex">
          <span className="tool-icon">
            <span
              onClick={() => {
                canvas?.transactionHandler.undo();
              }}
              className={`your-hand ${
                canvas?.transactionHandler.undos.length === 0 ? 'disactive' : ''
              }`}
            >
              <Undo />
            </span>
            <span
              onClick={() => canvas?.transactionHandler.redo()}
              className={`your-hand ${
                canvas?.transactionHandler.redos.length === 0 ? 'disactive' : ''
              }`}
            >
              <Redo />
            </span>
            <span onClick={handlePan} className="mouse-hand">
              <MoouseHand />
            </span>
          </span>
        </div>
        <form className="" onSubmit={formik.handleSubmit}>
          <div className="d-flex align-items-center">
            <input
              type="text"
              className="form-control"
              style={{ width: '200px', height: '30px', border: 'none', textAlign: 'center', marginRight: '10px' }}
              id="name"
              name="name"
              value={name}
              onChange={e => {
                const v = e.target.value
                formik.setFieldValue('name', v);
                setName(v);
              }}
            />
            <input
              type="text"
              className="form-control"
              style={{ width: '60px', height: '30px', border: 'none', textAlign: 'center' }}
              id="width"
              name="width"
              value={width}
              onChange={e => {
                const v = parseFloat(e.target.value);
                formik.setFieldValue('width', v);
                setWidthBg(v);
              }}
            />
            <div className="mx-3">x</div>
            <input
              type="text"
              className="form-control"
              style={{
                width: '60px',
                height: '30px',
                border: 'none',
                textAlign: 'center',
                marginRight: '20px',
              }}
              value={height}
              onChange={e => {
                const v = parseFloat(e.target.value);
                formik.setFieldValue('height', v);
                setHeightBg(v);
              }}
              id="height"
              name="height"
            />

            <button
              type="submit"
              style={{ color: '#fff', border: 'none', background: 'transparent' }}
              className={`${checkPermission() ? "nopermission": ''}`}
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </form>
        <div style={{ display: 'flex' }}>
          <div className="header-export" onClick={exportPng}>
            Export
          </div>
          {!auth.currentUser ? (
            <div className="header-export" onClick={() => setIsModalVisible(true)}>
              Login
            </div>
          ) : (
            <div className="header-export" onClick={() => logOut()}>
              Logout
            </div>
          )}
          <Auth
            visible={isModalVisible}
            onCancel={() => setIsModalVisible(false)}
          />
        </div>
      </div>
    </Style>
  );
}
