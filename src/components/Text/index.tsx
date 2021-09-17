import React, { useEffect, useState } from 'react';

import { db } from '@/intergations/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { v4 } from 'uuid';

import Data from '@/canvas/utils/InitialsLayer.json';
import TextBox from '@/canvas/objects/TextBox';

import Style from './Style';

interface Props {
  canvas: any;
}

window.husblizerFont = {};

const Index = ({ canvas }: Props) => {
  const [fonts, setFonts] = useState([]);

  useEffect(() => {
    const fetchsData = async () => {
      const fontsData = [];
      const querySnapshot = await getDocs(collection(db, 'tests'));
      querySnapshot.forEach(doc => {
        fontsData.push(doc.data());
      });

      setFonts(fontsData);
    };

    fetchsData();
  }, []);

  const handleAddTextBox = async (font: any) => {
    const initTextBox = Data.Layers[0];

    initTextBox.src = font.url;
    initTextBox.fontFamily = font.name;
    const newTextBoxPro = new TextBox({ ...initTextBox, id: v4() });

    canvas.add(newTextBoxPro);
    canvas.setActiveObject(newTextBoxPro);
    canvas.renderAll();

    canvas.transactionHandler.save('add');
  };

  return (
    <Style>
      <ul>
        {fonts.map((font, index) => (
          <li onClick={() => handleAddTextBox(font)} key={index}>
            <h2 style={{ fontFamily: font.name }}>The quick brown fox jumps over the lazy dog</h2>
            <p>{font.name}</p>
          </li>
        ))}
      </ul>
    </Style>
  );
};

export default Index;
