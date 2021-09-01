import React, { useState } from 'react';

import Canvas from '@/canvas/Canvas';

import withRedux from '@/libraries/withRedux';

function Index() {
  const [canvas, setCanvas]: any = useState();

  return (
    <div>
      <Canvas setCanvas={setCanvas} />
    </div>
  );
}

export default withRedux(Index);
