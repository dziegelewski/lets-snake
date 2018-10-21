require('./array-prorotype-flat');

const WebSocket = require('ws');

const Arena = require('./Arena');
const Snake = require('./Snake');
const { map } = require('./maps');

const PORT = process.env.PORT || 9000; 

const arena = new Arena().useMap(map);

const socketServer = new WebSocket.Server(
  { port: PORT },
  () => console.log(`Listening to port ${PORT}`),
);

socketServer.on('connection', (socket) => {
  const snake = new Snake()
  .joinArena(arena)
  .tail([
    {x: 10, y: 8},
    {x: 9, y: 8},
    {x: 8, y: 8},
    {x: 7, y: 8},
    {x: 6, y: 8},
    {x: 5, y: 8},
  ]);

  socket.on('message', (message) => {
    snake.turn(message);
  });
});

const broadcastBySocket = ((data) => {
  socketServer.clients.forEach((client) => {
    client.send(data);
  });
});

arena.toStream()
.map(JSON.stringify)
.subscribe(broadcastBySocket);
