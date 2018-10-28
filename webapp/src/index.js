import React from 'react';
import ReactDOM from 'react-dom';

import Board from 'components/Board';
import ControlYourSnake from 'components/ControlYourSnake';
import SocketSubscriber from 'components/SocketSubscriber';

import { socketUrl } from 'consts';

import './index.css';

ReactDOM.render(
  <SocketSubscriber socketUrl={socketUrl}>
    {(data, socket) => (
      <>
        <Board data={data} />
        <ControlYourSnake socket={socket} />
      </>
    )}
  </SocketSubscriber>,
  document.querySelector('#app'),
);
