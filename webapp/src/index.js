import React from 'react';
import ReactDOM from 'react-dom';

import Board from './components/Board';
import ControlYourSnake from './components/ControlYourSnake';

const socket = new WebSocket('ws://localhost:9000');

ReactDOM.render(
  <div>
    <Board socket={socket} />
    <ControlYourSnake socket={socket} />
  </div>,
  document.querySelector('#app'),
);
