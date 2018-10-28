import React from 'react';

import Message from 'components/Message';
import SnakesList from 'components/SnakesList';
import FoodLeft from 'components/FoodLeft';
import Draw from 'components/Draw';

import './style.css';

const Board = ({ data }) => {
  const { message, foodLeft, snakesDetails } = data;

  return (
  <div className="board">
      <Message showIf={message} color={'green'}>
        {message}
      </Message>
      <Draw data={data} />
      <FoodLeft foodLeft={foodLeft} />
      <SnakesList snakes={snakesDetails} />
    </div>
  );
}

export default Board;
