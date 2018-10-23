import React from 'react';

const SnakesList = ({ snakes }) => {

  const noPlayer = snakes.length === 0;
  // const singlePlayer = snakes.length === 1;

  if (noPlayer) {
    return (
      <h1>You may want to refresh your browser</h1>
    );
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
            </h2>
          ))
        }
      </ul>
    </div>
  );
}

export default SnakesList;
