import React from 'react';

import Point from 'components/Point';

import { colors } from 'consts';

const FoodLeft = ({ foodLeft }) => {
  return (
    <div>
      <Point color={colors.food} />
      <span>{foodLeft}</span>
    </div>
  );
}

export default FoodLeft;
