import React, {} from 'react'

import Style from './Style'

interface Props {
  top: number;
  right: number;
  display: string;
}

const Index = ({ top, right, display }: Props) => {

  return (
    <Style theme={{
      top,
      right,
      display
    }}>
      
    </Style>
  );
}

export default Index
