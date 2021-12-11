import React, { useState } from 'react';
import classnames from 'classnames';

import { Upload, Photos, Text, Background, Illustration } from '@/svg/index';

import Models from '@/components/Models/index';
import UploadFile from '@/components/Upload';
import Document from '@/components/Document';
import Library from '@/components/Library';

import TextModel from '../Text';

import Style from './Style';

const tabLists = [
  { name: 'Document', icon: <Illustration /> },
  { name: 'Photos', icon: <Photos /> },
  { name: 'Text', icon: <Text /> },
  { name: 'Library', icon: <Background /> },
  { name: 'Upload', icon: <Upload /> },
];

export default function index({ canvas }) {
  const [state, setState] = useState('Photos');

  const handleTab = (v: string) => {
    setState(v);
  };

  const renderGalery = (v: string) => {
    switch (v) {
      case 'Document':
        return <Document canvas={canvas} />;
      case 'Photos':
        return <Models canvas={canvas} />;
      case 'Text':
        return <TextModel canvas={canvas} />;
      case 'Upload':
        return <UploadFile canvas={canvas} />;
      case 'Library':
        return <Library canvas={canvas} />;
      default:
        return <Models canvas={canvas} />;
    }
  };

  return (
    <Style>
      <div className="panel-logo">Nemo</div>
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
