import React, { useState } from 'react';
import classnames from 'classnames';
import { useHistory } from 'react-router';

import { auth } from '@/intergations/firebase';

import { Upload, Photos, Text, Background, Illustration } from '@/svg/index';

import Models from '@/components/Models/index';
import UploadFile from '@/components/Upload';
import Document from '@/components/Document';
import Library from '@/components/Library';
import Shape from '@/components/Shape'

import TextModel from '../Text';

import Style from './Style';

const tabLists = [
  { name: 'Photos', icon: <Photos /> },
  { name: 'Text', icon: <Text /> },
  { name: 'My Document', icon: <Illustration /> },
  { name: 'Library', icon: <Background /> },
  { name: 'Upload', icon: <Upload /> },
  { name: 'Shape', icon: <Photos /> },
];

export default function index({ canvas }) {
  const [state, setState] = useState('Photos');
  const history = useHistory();

  const handleTab = (v: string) => {
    setState(v);
  };

  const renderGalery = (v: string) => {
    switch (v) {
      case 'Photos':
        return <Models canvas={canvas} />;
      case 'My Document':
        return (
          <div> {auth.currentUser ? <Document canvas={canvas} /> : <div>Please Login</div>}</div>
        );
      case 'Text':
        return <TextModel canvas={canvas} />;
      case 'Upload':
        return <UploadFile canvas={canvas} />;
      case 'Library':
        return <Library canvas={canvas} />;
      case 'Shape':
        return <Shape canvas={canvas} />;
      default:
        return <Models canvas={canvas} />;
    }
  };

  return (
    <Style>
      <div style={{ cursor: 'pointer' }} onClick={() => history.push('/')} className="panel-logo">
        Nemo
      </div>
      <div className="panel-main">
        <div className="panel-tab">
          <ul className="">
            {tabLists.map(item => (
              <li className="tab-item" onClick={() => handleTab(item.name)}>
                <div className="tab-item-icon">
                  <span className={classnames(item.name === state && 'tab-item-icon-active')}>
                    {item.icon}
                  </span>
                </div>
                <div
                  className={classnames(
                    'tab-item-name',
                    item.name === state && 'tab-item-name-active',
                  )}
                >
                  {item.name}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="panel-galery">{renderGalery(state)}</div>
      </div>
    </Style>
  );
}
