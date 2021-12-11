import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, doc } from 'firebase/firestore';
import { useHistory } from 'react-router-dom'
import { db, auth } from '@/intergations/firebase';

import Style from './Style';

const Index = ({ canvas }) => {
  const [documents, setDocuments] = useState([]);
  const history = useHistory()

  useEffect(() => {
    const fetchsDocument = async () => {
      const docsData = [];

      const q = query(
        collection(db, 'documents'),
        where('userId', '==', auth?.currentUser?.uid),
      );

      const docsSnap = await getDocs(q);

      docsSnap.forEach(doc => {
        docsData.push({ id: doc.id, ...doc.data() });
      });

      setDocuments(docsData)
    };

    fetchsDocument();
  }, []);

  const loadDocument = (id: string) => {
    history.push(`/vector/${id}`)
  }

  return (
    <Style>
      <div className="row">
        {documents.map((doc: any) => (
          <div style={{ cursor: 'pointer'}} onClick={() => loadDocument(doc.id)} className="col-6">
            <div className="doc-item">documents</div>
            <div className="">{doc.name}</div>
          </div>
        ))}
      </div>
    </Style>
  );
};

export default Index;
