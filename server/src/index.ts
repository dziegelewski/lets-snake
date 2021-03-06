import WebSocket from 'ws';
import { map } from 'rxjs/operators';

import { Arena } from './Arena';
import { Snake } from './Snake';
import { Direction, IBroadcastedData } from './types';
import { levelsSequence } from './levels';

const PORT = parseInt(process.env.PORT) || 9000;

const arena = new Arena().useLevelsGenerator(levelsSequence);

const socketServer = new WebSocket.Server(
  { port: PORT },
  () => console.log(`Listening to port ${PORT}`),
);

socketServer.on('connection', (socket) => {
  const snake = new Snake().joinArena(arena);

  socket.on('message', (directionMessage: Direction) => {
    snake.turn(directionMessage);
  }); 
});

const broadcastToEveryone = ((data: string): void => {
  socketServer.clients.forEach((client) => {
      client.send(data);
  });
});

const arenaStream = arena.toStream();

arenaStream
  .pipe(
    map((value: IBroadcastedData) => JSON.stringify(value))
  )
  .subscribe(broadcastToEveryone);
  