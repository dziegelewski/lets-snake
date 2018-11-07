"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
}
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const Arena_1 = __importDefault(require("./Arena"));
const Snake_1 = __importDefault(require("./Snake"));
const { levelsSequence } = require('./levels');
const PORT = parseInt(process.env.PORT) || 9000;
const arena = new Arena_1.default().useLevelsGenerator(levelsSequence);
const socketServer = new ws_1.default.Server({ port: PORT }, () => console.log(`Listening to port ${PORT}`));
socketServer.on('connection', (socket) => {
    const snake = new Snake_1.default().joinArena(arena);
    socket.on('message', (message) => {
        snake.turn(message);
    });
});
const broadcastToEveryone = ((data) => {
    // @ts-ignore
    socketServer.clients.forEach((client) => {
        client.send(data);
    });
});
const arenaStream = arena.toStream();
arenaStream
    .map((value) => JSON.stringify(value))
    .subscribe(broadcastToEveryone);
//# sourceMappingURL=index.js.map