const server = require('express')();
const http = require('http').createServer(server);
const io = require('socket.io')(http);

io.on('connection', (socket) => {
  console.log('A user connectd: ' + socket.id);

  io.on('disconnect', (socket) => {
    console.log('A user diconnected: ' + socket.id);
  });
});

http.listen(3000, () => {
  console.log('Server started up');
});
