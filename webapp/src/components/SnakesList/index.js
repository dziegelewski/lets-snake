import React, { Fragment } from 'react';

import Point from '../Point';
import { colors } from '../../consts';

const SnakesList = ({ snakes }) => {

  const noPlayer = snakes.length === 0;
  // const singlePlayer = snakes.length === 1;

  if (noPlayer) {
    return (
      <h1>You may want to refresh your browser</h1>
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
      <h1>Active snakes:</h1>
      <ul>
        {
          snakes.map((snake) => (
            <h2
              style={{ color: 'green' }} 
              key={snake.id}
            > 
              {snake.name}
              {trophies(snake.trophies)}
            </h2>
          ))
        }
      </ul>
    </div>
  );
}

export default SnakesList;
