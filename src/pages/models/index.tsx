import React, { useEffect, useState } from 'react'

import Style from './Style'
import Data from '@/canvas/utils/InitialsLayer.json'
import DynamicImagePro from '@/canvas/objects/DynamicImage'

import { db } from '@/intergations/firebase'
import { collection, getDocs } from 'firebase/firestore'

import { v4 } from 'uuid'

interface Props {
  canvas: any
}

const Index = ({ canvas }: Props) => {
  const [models, setModels] = useState([])

  useEffect(() => {

    const fetchsData = async () => {
      const modelsData = []
      const querySnapshot = await getDocs(collection(db, "models"));
      querySnapshot.forEach((doc) => {
        modelsData.push(doc.data())
      });

      setModels(modelsData)
    }

    fetchsData()

  }, [])

  const handleModel = (model: any) => {

    const initDynamic = Data.Layers[1]
    initDynamic.src = model.url
    const newDynamicImagePro = new DynamicImagePro({ ...Data.Layers[1], id: v4() })

    canvas.add(newDynamicImagePro)
    canvas.setActiveObject(newDynamicImagePro);
    canvas.renderAll()
  }

  return (
    <Style>
      <div className="header__models">
        <p>Models</p>
        <p>View all</p>
      </div>
      <div className="list__models">
        {models.map(model => (
          <div
            onClick={() => handleModel(model)}
            key={model.id}
          >
            <img src={model.url} />
          </div>
        ))}
      </div>
    </Style>
  )
}

export default Index