import * as React from 'react';

import { fieldSize } from 'consts';

import './style.css';

interface Props {
  color: string;
}

const Point = ({ color }: Props) => {

  return (
    <div className="point" style={{
      width: fieldSize,
      height: fieldSize,
      backgroundColor: color,
    }} />
  );
};

export default Point;
