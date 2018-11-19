import React from 'react';

import Point from 'components/Point';

import { times } from 'utils';
import { colors } from 'consts';

import { ISnake } from 'types';

import './style.css';

interface Props {
  snakes: ISnake[];
}

const SnakesList = ({ snakes }: Props) => {

  const noPlayer = snakes.length === 0;
  // const singlePlayer = snakes.length === 1;

  if (noPlayer) {
    return (
      <p>You may want to refresh your browser</p>
    );
  }

  const scores = (numberOfScores: number) => {
    return (
      <span>
        <Point color={colors.food} />
        {numberOfScores}
      </span>
    )
  };

  const trophies = (numberOfTrophies: number) => {
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
      <ul className="snakes-list">
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
