import React from 'react';
import { useFormik } from 'formik';
import { CloudUploadOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { v4 } from 'uuid';

import RenderForm from '@/Fragments/Form/index';

import DynamicImagePro from '@/canvas/objects/DynamicImage';
import Data from '@/canvas/utils/InitialsLayer.json';

import { logOut, auth, db } from '@/intergations/firebase';

import { uploadFile } from '@/actions/index';

import Style from './Style';

interface Props {
  canvas: any;
}

export default function Index({ canvas }: Props) {
  const dispatch = useDispatch();

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
      dispatch(uploadFile(e.url));
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
        <div className="">Upload</div>
        <div className="mb-3">{RenderForm(fieldUpload, formik)}</div>

        <div className="d-flex justify-content-between flex-wrap">
          {files.map((file, index) => (
            <div style={{ padding: '10px' }} onClick={() => handleModel(file)} className="">
              <img src={file} alt="" className="" />
            </div>
          ))}
        </div>
      </form>
    </Style>
  );
}
