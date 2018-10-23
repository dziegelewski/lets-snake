import React from 'react';

import { fieldSize } from '../../consts';

const Point = (props) => {
  const color = Object.keys(props)[0];

  return (
    <div style={{
      width: fieldSize,
      height: fieldSize,
      display: 'inline-block',
      verticalAlign: 'middle',
      backgroundColor: color,
    }} />
  )
};

export default Point;
