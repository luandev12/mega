import React, {} from 'react'

import Style from './Style'

interface Props {
  top: number;
  left: number;
  display: string;
}

const Index = ({ top, left, display }: Props) => {

  return (
    <Style theme={{
      top,
      left,
      display
    }}>
      
    </Style>
  );
}

export default Index
