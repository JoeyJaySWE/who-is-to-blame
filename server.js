const server = require('express')();
const http = require('http').createServer(server);

// io.on('connection', (socket) => {
//     console.log('A user connectd: ' + socket.id);

//     io.on('disconnect', (socket) => {
//         console.log('A user diconnected: ' + socket.id);
//     });
// });

const port = process.env.PORT || 8000

const serverListner = http.listen(port, () => {
  console.log('Server started up');
});

const io = require('./socket').init(serverListner);
