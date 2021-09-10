import React, { useState } from 'react';
import classnames from 'classnames';

import { Upload, Photos, Background, Illustration, Text } from '@/svg/index';

import Models from '@/pages/models/index';

import Style from './Style';

const tabLists = [
  { name: 'Photos', icon: <Photos /> },
  { name: 'Illustration', icon: <Illustration /> },
  { name: 'Background', icon: <Background /> },
  { name: 'Text', icon: <Text /> },
  { name: 'Upload', icon: <Upload /> },
];

export default function index({ canvas }) {
  const [state, setState] = useState('Photos');

  const handleTab = (v: string) => {
    setState(v);
  };

  const renderGalery = (v: string) => {
    switch (v) {
      case 'Photos':
        return <Models canvas={canvas} />;
      case 'Illustration':
        return 'Illustration';
      case 'Background':
        return 'Background';
      case 'Text':
        return 'Text';
      case 'Upload':
        return 'Upload';
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
      {/* <div className="header__models">
        <p>Models</p>
        <p>View all</p>
      </div>
      <div className="list__models"></div> */}
    </Style>
  );
}
