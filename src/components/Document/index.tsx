import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, doc } from 'firebase/firestore';
import { useHistory } from 'react-router-dom'
import { db, auth } from '@/intergations/firebase';
import { fabric } from 'fabric'
import { setLoading } from '@/actions'
import { useDispatch } from 'react-redux'

import Style from './Style';
import { backgroundPro } from '@/canvas/constants/defaults';

const Index = ({ canvas }) => {
  const [documents, setDocuments] = useState([]);
  const history = useHistory()
  const dispatch = useDispatch()

  useEffect(() => {
    const fetchsDocument = async () => {
      const docsData = [];

      const q = query(
        collection(db, 'documents'),
        where('userId', '==', auth?.currentUser?.uid),
      );

      // const p = query(
      //   collection(db, 'documents'),
      //   where('userId', '!=', auth?.currentUser?.uid),
      //   where('public', '==', true)
      // )

      const docsSnap = await getDocs(q);
      // const docsPublic = await getDocs(p)

      docsSnap.forEach(doc => {
        docsData.push({ id: doc.id, ...doc.data() });
      });
      // docsPublic.forEach(doc => {
      //   docsData.push({ id: doc.id, ...doc.data() });
      // });

      setDocuments(docsData)
    };

    fetchsDocument();
  }, []);

  useEffect(() => {

    const canvases: any = {}
    documents.forEach((doc: any, index: any) => {
      const { canvas: canvasDocument, width, height, color } = doc
      let ratio = width / 150
      let ratioHeight = height / 150
      const objs = JSON.parse(canvasDocument)
      objs.unshift(backgroundPro);
      objs[0].width = width || 1000
      objs[0].height = height || 1000
      objs[0].fill = color
      objs[0].full = true
      canvases[index] = new fabric.Canvas(`canvas__${index}`, {
        renderOnAddRemove: true,
        allowTouchScrolling: true,
        preserveObjectStacking: true,
        centeredKey: 'shiftKey',
      });

      const newDatas = objs.map(item => {
        if (item.type !== 'backgroundPro') {
          item.width = item.width / ratio;
          item.height = item.height / ratio;
          item.top = item.top / ratio + 75;
          item.left = item.left / ratioHeight + 75;
          item.minSize = item.minSize / ratio;
          item.maxSize = item.maxSize / ratio;
        }
        item.typeRender = true;
        item.evented = false;
        item.selectable = false;
        return item
      })
      
      canvases[index].setWidth(150);
      canvases[index].setHeight(150);
      canvases[index].loadFromJSON({ objects: newDatas });
    })
  
  }, [documents])

  const loadDocument = (id: string) => {
    dispatch(setLoading(true))
    const objs = []
    objs.unshift(backgroundPro);
    objs[0].full = false
    objs[0].typeRender = false
    canvas.loadFromJSON(
      {
        objects: objs,
      }
      );
      canvas.renderAll()
    setTimeout(() => {
      history.push(`/vector/${id}`)
    })
  }

  return (
    <Style>
      <div className="row">
        {documents.map((doc: any, index) => (
          <div style={{ cursor: 'pointer', position: 'relative' }} onClick={() => loadDocument(doc.id)} className="col-6">
            <div className="">{doc.name}</div>
            <div className="canvas__wrap">
              <canvas className="canvas__realtime" id={`canvas__${index}`}></canvas>
            </div>
          </div>
        ))}
      </div>
    </Style>
  );
};

export default Index;
