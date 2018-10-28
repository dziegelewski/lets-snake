import React from 'react';

import Message from 'components/Message';
import SnakesList from 'components/SnakesList';
import FoodLeft from 'components/FoodLeft';
import Draw from 'components/Draw';

import './style.css';

const Board = ({ data }) => {
  const { message = null, foodLeft, snakesDetails } = data;

  return (
    <div className="board">
      <div className="board__column board__column--main">
        <Draw data={data}>
          <Message showIf={message} color={'green'}>
            {message}
          </Message>
        </Draw>
      </div>
      <div className="board__column">
        <FoodLeft foodLeft={foodLeft} />
        <SnakesList snakes={snakesDetails} />
      </div>
    </div>
  );
}

export default Board;
