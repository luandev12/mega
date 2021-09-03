import React, { useState } from 'react';

import Canvas from '@/canvas/Canvas';

import withRedux from '@/libraries/withRedux';
import styles from './index.css'

function Index() {
  const [canvas, setCanvas]: any = useState();
  console.log(canvas)
  return (
    <div
      className={styles.page__container}
    >
      <div className={styles.items__container}></div>
      <div
        className={styles.canvas__container}
      >
        <Canvas setCanvas={setCanvas} />
      </div>
    </div>
  );
}

export default withRedux(Index);
