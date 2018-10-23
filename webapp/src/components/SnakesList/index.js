import React from 'react';

const SnakesList = ({ names }) => {
  return (
    <ul>
      {
        names.map((name) => (
          <p>Snake {name}</p>
        ))
      }
    </ul>
  )
}

export default SnakesList;
