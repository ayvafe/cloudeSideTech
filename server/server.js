const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const path = require('path');
const fs = require('fs');
const serverPort = "5004";
const socketAuth = require('socketio-auth');
const socketIo = require("socket.io");
const mongoose = require("mongoose");
global.mongoose = mongoose;

let config = require('./config');
let auth = require('./auth');
let middleware = require('./middleware');

// Connect to database
mongoose.connect(`mongodb://${config.server}/${config.database}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Successfully connected to the database');
}).catch(err => {
  console.log('error connecting to the database  ' + err);
  process.exit();
});

//Load models
const User = require('./user.js');

//Generating uinique ID for each WebSocket client
const getUniqueID = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return s4() + s4() + '-' + s4();
};

// Starting point of the server
function main () {
  const port = process.env.PORT || serverPort;
  const app = express(); 
  const server = http.createServer(app);
  app.use(bodyParser.json());
  app.post('/login', auth.login);
  app.get('/check_token', middleware.checkToken);
  app.get('/sign_up', auth.signup);
  app.get('/rooms_list', middleware.getRoomsList);
  app.listen(port, function() {
    console.log('Server up and running at %s port', port);
  });
  io = socketIo.listen(server);
  handleWebSockects();
}

function sendRoommates(id) {
  User.findOne({'id': id}).exec()
    .then(user => { 
      var c = io.sockets.clients(user.currentRoomId);
      return c;
    })
    .catch(err => {
      return done(err);
    });
} 

function getUserRoomID(username) {
  User.findOne({'email': username}).exec()
    .then(user => { 
      return user.currentRoomId;
    })
    .catch(err => {
      return done(err);
    });
} 

function addRoomNumber(s_id, r_id) {
  User.findOne({'id': r_id}).exec()
    .then(user => { 
      let u = User.findOneAndUpdate(user, {"currentRoomId" : r_id}, {
        new: true,
        upsert: true
      });
    })
    .catch(err => {
      return done(err);
    });
} 

function getUserName(id) {
  User.findOne({'id': r_id}).exec()
    .then(user => { 
      return user.firstName + ' ' + user.lastName;
    })
    .catch(err => {
      return done(err);
    });
} 

function addSocketId(ei, id) {
  User.findOne({'email': e }).exec()
    .then(user => { 
      let u = User.findOneAndUpdate(user, {"id" : id}, {
        new: true,
        upsert: true
      });
    })
    .catch(err => {
      return done(err);
    });
} 

function handleWebSockects() {
  console.log("Running socket");
  io.on('connection', function (socket) {
    socket.on("email", function (e) {
      addSocketId(e,socket.id);
    });

    socket.on('message', function (msg) {
      socket.broadcast.to(getUserRoomID(socket.id)).emit('message', msg);
    });

    socket.on('joinRoom', function (r_id) {
      socket.join(r_id);
      addRoomNumber(socket.id, r_id);
    });

    socket.on('roommates', function () {
      socket.emit("roommates", sendRoommates(socket.id));
    });
    
    socket.on('disconnect', function(username) {
        io.emit('is_online', '🔴 <i>' + getUserName(socket.id) + ' left the chat..</i>');
    })
  });
}

main();
