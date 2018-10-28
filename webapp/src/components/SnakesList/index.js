import React, { Fragment } from 'react';

import Point from 'components/Point';
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

  const trophies = (numberOfTrophies) => {
    return (
      <Fragment>
        {new Array(numberOfTrophies).fill(null).map((trophy, index) => (
          <Point color={colors.trophy} key={index} />
        ))}
      </Fragment>
    )
  } 

  return (
    <div>
      <p>Active snakes:</p>
      <ul>
        {
          snakes.map((snake) => (
            <p
              style={{ color: colors.snake }} 
              key={snake.id}
            > 
              {snake.name}
              {trophies(snake.trophies)}
            </p>
          ))
        }
      </ul>
    </div>
  );
}

export default SnakesList;
