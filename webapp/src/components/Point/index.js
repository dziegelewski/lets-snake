import React from 'react';

import { fieldSize } from 'consts';

import './style.css';

const Point = ({ color }) => {

  return (
    <div className="point" style={{
      width: fieldSize,
      height: fieldSize,
      backgroundColor: color,
    }} />
  );
};

export default Point;
