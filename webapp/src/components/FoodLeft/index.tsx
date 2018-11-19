import * as React from 'react';

import Point from 'components/Point';

import { colors } from 'consts';

interface Props {
  foodLeft: number;
}

const FoodLeft = ({ foodLeft }: Props) => {
  return (
    <div>
      <Point color={colors.food} />
      <span>{foodLeft}</span>
    </div>
  );
}

export default FoodLeft;
