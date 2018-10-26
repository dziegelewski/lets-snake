import React from 'react';
import ReactDOM from 'react-dom';

import Board from './components/Board';
import ControlYourSnake from './components/ControlYourSnake';
import SocketSubscriber from './components/SocketSubscriber';

// const socketUrl = "ws://blooming-spire-36184.herokuapp.com"
const socketUrl = "ws://localhost:9000";

ReactDOM.render(
  <div style={{ margin: '20px auto', textAlign: 'center', 'position': 'relative' }}>  
    <SocketSubscriber socketUrl={socketUrl}>
      {(data, socket) => (
        <>
          <Board data={data} />
          <ControlYourSnake socket={socket} />
        </>
      )}
    </SocketSubscriber>,
  </div>,
  document.querySelector('#app'),
);
