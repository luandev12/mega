import React, { useEffect, useState, useRef } from 'react';
import { useFormik } from 'formik';
import { CloudUploadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { v4 } from 'uuid';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, setDoc, collection, getDocs, query, where, deleteDoc } from 'firebase/firestore';
import { DeleteOutlined } from '@ant-design/icons';
import { message } from 'antd';

import { auth, db, storage } from '@/intergations/firebase';
import RenderForm from '@/Fragments/Form/index';

import DynamicImagePro from '@/canvas/objects/DynamicImage';
import Data from '@/canvas/utils/InitialsLayer.json';

import { uploadFile } from '@/actions/index';

import Style from './Style';

interface Props {
  canvas: any;
}

export default function Index({ canvas }: Props) {
  const dispatch = useDispatch();

  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(false);

  const files = useSelector((state: any) => state.files);

  // field type
  const fieldUpload = {
    type: 'input',
    tag: 'upload',
    name: 'file',
    col: 'col-12',
    label: '',
    placeholder: <CloudUploadOutlined style={{ color: '#fff', fontSize: '30px' }} />,
    onChange: (e: any) => {
      console.log(e, 'upload');

      const storageRef = ref(storage, 'uploads/' + v4());
      const uploadTask = uploadBytesResumable(storageRef, e.files[0]);

      setLoading(true);

      uploadTask.on(
        'state_changed',
        snapshot => {
          const pg = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + pg + '% done');

          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        error => {
          switch (error.code) {
            case 'storage/unauthorized':
              break;
            case 'storage/canceled':
              break;
            case 'storage/unknown':
              break;
          }
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async downloadURL => {
            console.log('File available at', downloadURL);
            setLoading(false);

            dispatch(uploadFile(downloadURL));
            await setDoc(doc(db, 'uploads', v4()), {
              url: downloadURL,
              userId: auth?.currentUser?.uid,
            });
            fetchsDocument();
          });
        },
      );
    },
  };

  const handleModel = async (url: any) => {
    const initDynamic = Data.Layers[1];

    initDynamic.src = url;

    const newDynamicImagePro = new DynamicImagePro({ ...initDynamic, id: v4() });

    canvas.add(newDynamicImagePro);
    canvas.setActiveObject(newDynamicImagePro);
    canvas.renderAll();

    canvas.transactionHandler.save('add');
  };

  const fetchsDocument = async () => {
    const docsData = [];

    const q = query(collection(db, 'uploads'), where('userId', '==', auth?.currentUser?.uid));
    const docsSnap = await getDocs(q);

    docsSnap.forEach(doc => {
      docsData.push({ id: doc.id, ...doc.data() });
    });

    setUploads(docsData);
  };

  useEffect(() => {
    fetchsDocument();
  }, []);

  // init formik
  const formik = useFormik({
    initialValues: {},
    onSubmit: async values => {
      console.log(values);
    },
  });

  return (
    <Style>
      <form onSubmit={formik.handleSubmit} className="">
        <div className="">{loading ? `Uploading...` : 'Upload'}</div>
        <div className="mb-3">{RenderForm(fieldUpload, formik)}</div>

        <div className="d-flex justify-content-between flex-wrap">
          {uploads.map((file, index) => (
            <div style={{ padding: '10px', position: 'relative' }} className="">
              <img src={file.url} onClick={() => handleModel(file.url)} alt="" className="" />
              <span
                onClick={async (e: any) => {
                  console.log('deklte bfb');
                  await deleteDoc(doc(db, 'uploads', file.id));
                  fetchsDocument();
                  message.success('Delete Success');
                }}
                style={{
                  position: 'absolute',
                  left: '15px',
                  zIndex: 9999,
                  cursor: 'pointer',
                }}
                className=""
              >
                <DeleteOutlined />
              </span>
            </div>
          ))}
        </div>
      </form>
    </Style>
  );
}
