import React from 'react';

import { fieldSize } from '../../consts';

const Point = ({ color }) => {

  return (
    <div style={{
      width: fieldSize,
      height: fieldSize,
      display: 'inline-block',
      verticalAlign: 'middle',
      backgroundColor: color,
      margin: '0 3px',
    }} />
  )
};

export default Point;
