const port = process.env.REACT_APP_API_BASE_URL || "8080";
const User = require('./user.js');
const Room = require('./room.js');
const socket = require('socket.io');
const app = require('./app');

require('dotenv').config();

// Starting point of the server
const server = app.listen(port, function() {
  console.log('Server up and running at %s port', port);
});

io = socket(server);

io.on('connection', function (socket) {
  socket.currentRoomId = 'default';
  socket.username = '';
  socket.on("email", function (e) {
    socket.email = e;
    User.findOne({'email': e}).exec()
      .then(user => {
        if(user != null) {
          socket.leave(socket.currentRoomId);
          socket.currentRoomId = user.currentRoomId;
          socket.username = user.firstName + ' ' + user.lastName;
          socket.join(socket.currentRoomId);
          let msg = '🔵   ' + socket.username + ' joined to the chat..';
          socket.broadcast.to(socket.currentRoomId).emit('is_online', msg);
        }
      })
      .catch(err => {
        console.log(" ERROR while trying to get user data : " + err);
      });
  });

  socket.on('message', function (msg) {
    console.log(msg);
    socket.broadcast.to(socket.currentRoomId).emit('message', msg);
  });

  socket.on('joinRoom', function (r_id) {
    console.log(r_id)
    socket.join(r_id);
    socket.currentRoomId = r_id;
    addRoomNumber(socket.email, r_id);
  });

  socket.on('roommates', function () {
    sendRoommates(socket);
  });

  socket.on('roomName', function (rm) {
    sendRoomName(rm, socket);
  });

  socket.on('disconnect', function() {
    let msg = '🔴   ' + socket.username + ' left the chat..';
    socket.broadcast.to(socket.currentRoomId).emit('is_online', msg);
  })
});

function sendRoommates(s) {
  io.of('/').in(s.currentRoomId).clients((error, clients) => {
    if (error) {
      throw error
      console.log(error);
      return;
    }
    let r = [];
    for (i of clients) {
      if(io.sockets.connected[i].email != s.email) {
        r.push(io.sockets.connected[i].username);
      }
    }
    s.emit("roommates", r);
  });
}

function addRoomNumber(e, r_id) {
  User.findOne({'email': e}).exec()
    .then(user => { 
      user.currentRoomId = r_id
      user.save();
    })
    .catch(err => {
      console.log(" ERROR while trying to get user data : " + err);
    });
} 

function sendRoomName(rm, socket) {
  Room.findById(rm).exec()
    .then(room => {
      if(room != null) {
        socket.emit("roomName", room.name);
      }
    })
    .catch(err => {
      console.log(" ERROR while trying to get user data : " + err);
    });
} 
