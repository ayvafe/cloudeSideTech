const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const path = require('path');
const fs = require('fs');
const serverPort = "5004";
var mongoose = require('mongoose');
global.mongoose = mongoose;

let config = require('./config');
let auth = require('./auth');
let middleware = require('./middleware');

// Connect to database
var mongoDB = 'mongodb://127.0.0.1';
mongoose.connect(mongoDB, { useNewUrlParser: true });

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

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
  io = require('socket.io').listen(server);
  
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
  app.get('/check_token', middleware.checkToken);
  app.get('/rooms_list', middleware.getRoomsList);
  app.post('/sign_up', auth.signup);
  app.listen(port, function() {
    console.log('Server up and running at %s port', port);
  });
  handleWebSockects();
}

function sendRoommates(id) {
  User.findOne({'id': id}).exec()
    .then(user => { 
      var c = io.sockets.clients(user.currentRoomId);
      return c;
    })
    .catch(err => {
      console.log(" ERROR while trying to get user data : " + err);
      return '';
    });
} 

function getUserRoomID(username) {
  User.findOne({'email': username}).exec()
    .then(user => { 
      return user.currentRoomId;
    })
    .catch(err => {
      console.log(" ERROR while trying to get user data : " + err);
      return '';
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
      console.log(" ERROR while trying to get user data : " + err);
      return '';
    });
} 

function getUserName(id) {
  User.findOne({'id': r_id}).exec()
    .then(user => { 
      return user.firstName + ' ' + user.lastName;
    })
    .catch(err => {
      console.log(" ERROR while trying to get user data : " + err);
      return '';
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
      console.log(" ERROR while trying to get user data : " + err);
      return '';
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
