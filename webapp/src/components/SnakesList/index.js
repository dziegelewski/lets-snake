import React from 'react';

import Point from 'components/Point';

import { times } from 'utils';
import { colors } from 'consts';

import './style.css';

const SnakesList = ({ snakes }) => {

  const noPlayer = snakes.length === 0;
  // const singlePlayer = snakes.length === 1;

  if (noPlayer) {
    return (
      <p>You may want to refresh your browser</p>
    );
  }

  const scores = (numberOfScores) => {
    return (
      <span>
        <Point color={colors.food} />
        {numberOfScores}
      </span>
    )
  };

  const trophies = (numberOfTrophies) => {
    return (
      <span>
        {times(numberOfTrophies, (index) => (
          <Point color={colors.trophy} key={index} />
        ))}
      </span>
    )
  };

  return (
    <div>
      <p>Active snakes:</p>
      <ul>
        {
          snakes.map((snake) => (
            <li
              className="snake-list-item"
              style={{ color: colors.snake }} 
              key={snake.id}
            > 
              {snake.name}

              {scores(snake.scores)}

              {trophies(snake.trophies)}
            </li>
          ))
        }
      </ul>
    </div>
  );
}

export default SnakesList;
