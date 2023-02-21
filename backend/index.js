const app = require('express')();
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer, {
  cors: {origin : '*'}
});

const port = process.env.PORT || 3000;
const globalRoom = "Global Room";

io.on('connection', (socket) => {

    //console.log(`Guest${socket.id.substr(3, 2)} connected`);
   // console.log(`${user} connected`);

    socket.on('message', (message) => {
     // console.log(message);
      //io.emit('message', `${message}`);
      socket.to(globalRoom).emit('message', {user: socket.data.user,message});
    });

    socket.on('join', async (userName, callback) => {
      //console.log(user);
      socket.data.user = userName;
      socket.join(globalRoom)
      socket.broadcast.to(globalRoom).emit('userJoined',socket.data.user);
      const socks = await io.in(globalRoom).fetchSockets();
      const users = socks.map(s => s.data.user);
      callback(users)
    });

    socket.on('disconnect', () => {
      //console.log(`Guest-${socket.id.substr(3, 2)} disconnected`);
      console.log(`${socket.data.user} disconnected`);
      socket.to(globalRoom).emit('userleft',socket.data.user);
    });
  
});

httpServer.listen(port, () => console.log(`listening on port ${port}`));