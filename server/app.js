const mongoose = require('mongoose');
global.mongoose = mongoose;
const express = require('express');
const bodyParser = require('body-parser');
const middleware = require('./middleware');
const auth = require('./auth');

require('dotenv').config();

// Connect to database
var mongoDB = process.env.DATABASE;
mongoose.connect(mongoDB, { useNewUrlParser: true,  useUnifiedTopology: true });

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

middleware.importRoomsIntoDb();

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

module.exports = app;
