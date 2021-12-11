import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where, doc } from 'firebase/firestore';

import { db } from '@/intergations/firebase';

import Style from './Style';

const Index = ({ canvas }) => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchsDocument = async () => {
      const docsData = [];

      const q = query(
        collection(db, 'documents'),
        where('userId', '==', 'h3RRKZWy54QIXWHZRferuWDMMKz2'),
      );

      const docsSnap = await getDocs(q);

      docsSnap.forEach(doc => {
        docsData.push(doc.data());
      });

      setDocuments(docsData);
    };

    fetchsDocument();
  }, []);

  return (
    <Style>
      <div className="row">
        {documents.map((doc: any) => (
          <div className="col-6">
            <div className="doc-item">documents</div>
            <div className="">{doc.name}</div>
          </div>
        ))}
      </div>
    </Style>
  );
};

export default Index;
