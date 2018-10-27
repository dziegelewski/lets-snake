import React from 'react';
import ReactDOM from 'react-dom';

import Board from './components/Board';
import ControlYourSnake from './components/ControlYourSnake';
import SocketSubscriber from './components/SocketSubscriber';

 const socketUrl = process.env.NODE_ENV === 'production'
   ? "ws://blooming-spire-36184.herokuapp.com"
   : "ws://localhost:9000"

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
