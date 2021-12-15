import React, { useState } from 'react';
import { fabric } from 'fabric';
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import { Modal, message, Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { v4 } from 'uuid';
import { useHistory } from 'react-router';
import Checkbox from 'antd/lib/checkbox/Checkbox';

import { Undo, Redo, MoouseHand } from '@/svg/index';

import { logOut, auth, db } from '@/intergations/firebase';

import Auth from '../Auth';

import Style from './Style';

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
  publicDoc: any;
  setPublic: any;
  document?: any;
}

export default function index({
  canvas,
  color,
  height,
  width,
  setWidthBg,
  setHeightBg,
  name,
  setName,
  publicDoc,
  setPublic,
}: Props) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const history = useHistory();
  const userID = useSelector((state: any) => state.user);

  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const exportPng = async () => {
    const objRender = canvas?.getObjects().map(async obj => {
      const item = { ...obj.toJSON() };

      if (item.type === 'backgroundPro') {
        item.fill = color;
        item.height = height;
        item.width = width;
      }

      // if (item.src) {
      //   const src: any = await getBlobFromUrl(item.src);
      //   item.src = src;
      // }
      item.typeExport = true;
      item.typeRender = true;

      return item;
    });
    const canvasRender = new fabric.Canvas(null, {});

    canvasRender.width = width;
    canvasRender.height = height;

    Promise.all(objRender).then(data => {
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
    if (window.location.pathname === '/' && auth?.currentUser?.uid) return false;

    return !auth?.currentUser?.uid || userID !== auth.currentUser.uid;
  };

  const handleSave = async () => {
    if (checkPermission()) {
      message.error("You haven't permission");

      return;
    }
    try {
      const objs = canvas.getObjects().filter(item => item.id && item.id !== 'workarea');
      let uuid;
      if (window.location.pathname === '/') {
        uuid = v4();
      } else {
        uuid = window.location.pathname.split('/')[2];
      }
      await setDoc(doc(db, 'documents', uuid), {
        canvas: JSON.stringify(objs),
        width,
        height,
        color,
        name,
        userId: auth?.currentUser?.uid,
        public: publicDoc,
      });

      message.success('Save success');
      history.push(`/vector/${uuid}`);
    } catch (error) {
      console.log(error, 'error');
    }
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    navigator.clipboard.writeText(window.location.href);
    message.success('Share is success');
    setVisible(false);
    setConfirmLoading(false);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const shareLink = () => {
    showModal();
  };

  const handleDelete = async () => {
    if (checkPermission()) {
      message.error("You haven't permission");

      return;
    }
    const id = window.location.pathname.split('/')[2];
    await deleteDoc(doc(db, 'documents', id));
    message.success('Delete Success');

    history.push('/');
  };

  return (
    <Style>
      <Modal
        title="Share a document"
        visible={visible}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>{window.location.href}</p>
      </Modal>

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
            <Checkbox
              checked={publicDoc}
              style={{ display: 'flex', cursor: 'pointer', marginLeft: '15px' }}
              onChange={e => setPublic(e.target.checked)}
            >
              <span style={{ marginLeft: '5px' }}>Public</span>
            </Checkbox>
            {window.location.pathname !== '/' && (
              <span
                onClick={handleDelete}
                className="d-flex align-items-center"
                style={{ marginLeft: '20px', cursor: 'pointer' }}
              >
                <DeleteOutlined />
                <span
                  className={`${checkPermission() ? 'nopermission' : ''}`}
                  style={{ marginLeft: '10px' }}
                >
                  Delete
                </span>
              </span>
            )}
          </span>
        </div>
        <form className="" onSubmit={formik.handleSubmit}>
          <div className="d-flex align-items-center">
            <input
              type="text"
              className="form-control"
              style={{
                width: '200px',
                height: '30px',
                border: 'none',
                textAlign: 'center',
                marginRight: '10px',
              }}
              id="name"
              name="name"
              value={name}
              onChange={e => {
                const v = e.target.value;
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
              className={`${checkPermission() ? 'nopermission' : ''}`}
              onClick={handleSave}
            >
              Save
            </button>
          </div>
        </form>
        <div style={{ display: 'flex' }}>
          <div className="header-export" onClick={shareLink}>
            Share
          </div>
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
          <Auth visible={isModalVisible} onCancel={() => setIsModalVisible(false)} />
        </div>
      </div>
    </Style>
  );
}
