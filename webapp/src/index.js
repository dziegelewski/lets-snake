import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';

import Board from './components/Board';
import ControlYourSnake from './components/ControlYourSnake';
import SocketSubscriber from './components/SocketSubscriber';

const socket = new WebSocket('ws://localhost:9000');

ReactDOM.render(
  <Fragment>
    <SocketSubscriber socket={socket}>
      <Board />
    </SocketSubscriber>
    <ControlYourSnake socket={socket} />
  </Fragment>,
  document.querySelector('#app'),
);
