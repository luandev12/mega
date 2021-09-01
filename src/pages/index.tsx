import React, { useState } from 'react';

import Canvas from '@/canvas/Canvas';

export default function() {
  const [canvas, setCanvas]: any = useState();

  return (
    <div>
      <Canvas setCanvas={setCanvas} />
    </div>
  );
}
