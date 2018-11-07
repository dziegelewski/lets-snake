import WebSocket from 'ws';

import Arena from './Arena';
import Snake from './Snake';
const { levelsSequence } = require('./levels');

const PORT = parseInt(process.env.PORT) || 9000;

const arena = new Arena().useLevelsGenerator(levelsSequence);

const socketServer = new WebSocket.Server(
  { port: PORT },
  () => console.log(`Listening to port ${PORT}`),
);

socketServer.on('connection', (socket) => {
  const snake = new Snake().joinArena(arena);

  socket.on('message', (message) => {
    snake.turn(message);
  });
});

const broadcastToEveryone = ((data: Object) => {
  // @ts-ignore
    socketServer.clients.forEach((client) => {
    client.send(data);
  });
});

const arenaStream = arena.toStream();

arenaStream
  .map((value) => JSON.stringify(value))
  .subscribe(broadcastToEveryone);