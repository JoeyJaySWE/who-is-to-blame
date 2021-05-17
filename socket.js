const socketIo = require('socket.io');

let io;
let userCounter = 1;

const DRAW_EVENT = 'draw';

module.exports = {
  init: (server) => {
    io = socketIo(server, {
      pingTimeout: 60000,
      cors: {
        origin: 'http://localhost:8080',
      },
    });

    io.on('connection', (socket) => {
      socket.username = `user${userCounter}`;
      userCounter++;
      console.log(`${socket.username} connected`);

      //   socket.on(DRAW_EVENT, drawController);

      socket.once('disconnect', () => {
        console.log(`${socket.username} disconnected`);
      });
    });

    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('socket.io not initialized');
    }
    return io;
  },
};
