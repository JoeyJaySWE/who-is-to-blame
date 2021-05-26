const socketIo,{Server} = require('socket.io');

let io;
let userCounter = 1;

module.exports = {
  init: (server) => {
   io = new Server(httpServer, {
      cors: { origin: '*' },
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

      socket.emit('playerId', socket.username);

      // switch (socket.username) {
      //   case 'user1':
      //     players.hostName = socket.username;
      //     console.log('User1 ' + players);
      //     io.sockets.emit('HostJoin', JSON.stringify(players.hostName));
      //     io.sockets.emit('assignPlayers', JSON.stringify(players));
      //     break;

      //   case 'user2':
      //     players.player2 = socket.username;
      //     console.log('User2 ' + players);
      //     io.sockets.emit('Player2Join', JSON.stringify(players.player2));
      //     io.sockets.emit('assignPlayers', JSON.stringify(players));
      //     break;

      //   case 'user3':
      //     players.player3 = socket.username;
      //     io.sockets.emit('Player3Join', JSON.stringify(players.player3));
      //     break;
      // }
      socket.emit('PlayerView', JSON.stringify(socket.username));
      console.log(players);
      console.log(`${socket.username} connected`);
      io.sockets.emit('PlayerLoad', JSON.stringify(players));

      socket.on('HostNamed', (hostName) => {
        console.log(`Hostname updated to: ${hostName}`);
        players.hostName = hostName;
        console.log(`Players hostname: ${players.hostName}`);
        io.sockets.emit('userJoined', players.hostName);
      });

      //   socket.on(DRAW_EVENT, drawController);

      socket.once('disconnect', () => {
        console.log(`${socket.username} disconnected`);
        --userCounter;
      });

      socket.on('SwitchTurn', (accused) => {
        console.log(`${accused}'s turn`);
        io.sockets.emit('NewStand', accused);
        // socket.emi('PlayerId', )
      });

      socket.on('EvidenceDropped', (evidence, player) => {
        console.log(`Evidence dropped:`, evidence);
        io.sockets.emit('EvidenceDropped', { evidence, player });
      });

      socket.on('BlameDropped', (blame, player) => {
        console.log(`Blame dropped: ${blame}`);
        io.sockets.emit('BlameDropped', { blame, player });
      });

      socket.on('Strike', (guilty) => {
        console.log(`Strike on ${guilty}`);
        io.sockets.emit('Strike', guilty);
      });
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
