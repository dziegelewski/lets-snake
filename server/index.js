require('./array-prorotype-flat');

const WebSocket = require('ws');

const Arena = require('./Arena');
const Snake = require('./Snake');
const { levelsSequence } = require('./levels');

const PORT = process.env.PORT || 9000; 

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

const broadcastToEveryone = ((data) => {
  socketServer.clients.forEach((client) => {
    client.send(data);
  });
});

const arenaStream = arena.toStream();

arenaStream
  .map(JSON.stringify)
  .subscribe(broadcastToEveryone);