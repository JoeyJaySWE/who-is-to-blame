const socketIo = require('socket.io');

let io;
let userCounter = 1;

module.exports = {
  init: (server) => {
    io = socketIo(server, {
      pingTimeout: 60000,
      cors: {
        origin: 'http://localhost:8080',
      },
    });
    let players = {
      hostName: '',
      player2: '',
      player3: '',
    };

    io.on('connection', (socket) => {
      socket.username = `user${userCounter}`;
      userCounter++;
      let hostName;
      let player2;
      let player3;
      switch (socket.username) {
        case 'user1':
          players.hostName = socket.username;
          console.log('User1 ' + players);
          io.sockets.emit('HostJoin', JSON.stringify(players));
          break;

        case 'user2':
          players.player2 = socket.username;
          console.log('User2 ' + players);
          io.sockets.emit('broadcast', JSON.stringify(players.player2));
          io.sockets.emit('Player2Join', JSON.stringify(players.player2));
          break;

        case 'user3':
          players.player3 = socket.username;
          io.sockets.emit('Player3Join', JSON.stringify(players.player3));
          break;
      }
      socket.emit('PlayerView', JSON.stringify(socket.username));
      console.log(players);
      console.log(`${socket.username} connected`);
      io.sockets.emit('PlayerLoad', JSON.stringify(players));

      //   socket.on(DRAW_EVENT, drawController);

      socket.once('disconnect', () => {
        console.log(`${socket.username} disconnected`);
        --userCounter;
      });
    });

    io.on('HostNamed', (hostName) => {
      console.log(`Hostname updated to: ${hostName}`);
      players.hostName = hostName;
      console.log(`Players hostname: ${players.hostName}`);
    });

    io.on('PlayerLoad', () => {
      console.log('Recived data');
      socket.emit('PlayerList', JSON.stringify(players));
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
