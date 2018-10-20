require('./array-prorotype-flat');
const WebSocket = require('ws');

const Arena = require('./Arena');
const Snake = require('./Snake');
const { map } = require('./maps');

const arena = new Arena().useMap(map)
const socket = new WebSocket.Server({ port: 9000 });

socket.on('connection', (innerSocket) => {

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

  innerSocket.on('message', (message) => {
    snake.turn(message)
  });
})


const broadcastBySocket = (() => {

  return (data) => {
    socket.clients.forEach((client) => {
      client.send(data);
    })
  };
})();


arena.toStream()
.map(JSON.stringify)
.subscribe(broadcastBySocket)
