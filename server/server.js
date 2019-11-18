const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const serverPort = "8080";
var mongoose = require('mongoose');
global.mongoose = mongoose;
const User = require('./user.js');
const Room = require('./room.js');

let auth = require('./auth');
let middleware = require('./middleware');

// Connect to database
var mongoDB = 'mongodb://127.0.0.1:28105/messenger-app';
mongoose.connect(mongoDB, { useNewUrlParser: true,  useUnifiedTopology: true });

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Starting point of the server
function main () {
  const port = process.env.PORT || serverPort;
  const app = express(); 

  app.use(bodyParser.json());

  // Enable CORS
  app.use(function (req, res, next) {
    const origin = req.get('origin');
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma');
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
      return res.status(200).json({});
    }
    next();
  });

  app.post('/login', auth.login);
  app.post('/sign_up', auth.signup);
  app.get('/login_with_token', auth.login_with_token);
  app.get('/check_token', auth.checkToken, auth.index);
  app.get('/rooms_list', middleware.getRoomsList);
  const server = app.listen(port, function() {
    console.log('Server up and running at %s port', port);
  });
  var socket = require('socket.io');
  io = socket(server);
  handleWebSockects();
  middleware.importRoomsIntoDb();
}

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

function handleWebSockects() {
  console.log("Running socket");
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
}

main();
