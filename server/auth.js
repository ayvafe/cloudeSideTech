const config = require('./config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const dbUrl = '';
const User = require('./user.js'); 
const Room = require('./room.js');

//Response error to client request
var error = (res) => {
  return res.status(500).json({
    status: 'error',
    code : '500',
    data : 'Something is wrong. Please try again later.'
  });
}

//handle user signup
var signup = (req, res, next) => {
  if(!req.body || !req.body.email || !req.body.password 
    || !req.body.lastname|| !req.body.firstname) {

    return error(res);
  }

  User.findOne({'email': req.body.email}).exec()
    .then(user => { 
      if (user) {
        return res.status(422).json({
          status: 'fail',
          code: '422',
          data: {
            title: 'This email has been used for another account'
          }
        });
      }

      const newUser = new User();

      // Generate the hashed password
      bcrypt.hash(req.body.password, 10)
        .then(hash => {
          // User can be created when reaching here
          newUser._id = new mongoose.Types.ObjectId();
          newUser.email = req.body.email;
          newUser.firstName = req.body.firstname;
          newUser.lastName = req.body.lastname;
          newUser.password = hash;
          newUser.currentRoomId = Rooms.findOne({ name: 'Default' }, null);
        })
        .then(result => {
          const token = jwt.sign(
            {
              email: newUser.email,
              firstName: newUser.firstName,
              lastName: newUser.lastName,
            },
            'reactJsmessengerapp',
            { 
              expiresIn: '24h' // expires in 24 hours
            }
          );
          newUser.token = token;
          newUser.save();
          return res.status(201).json({
            status: 'success',
            code: '201',
            data: {
              token: token,
              user : newUser 
            }
          })
        })
        .catch(err => {
          return error(res);
        });
    })
    .catch(err => {
      return error(res);
    });
}

//handle user signin
var login = (req, res, next) => {
  if(!req.body || !req.body.email || !req.body.password) {
    return error(res);
  }
  let user = null;
  User.findOne({'email': req.body.email}).exec()
    .then(response => {
      if (!response) {
        return error(res);
      }

      user = response;
      // If user exists, then check if the password is correct
      bcrypt.compare(req.body.password, response.password)
        .then(result => {
          if (result === false) {
            return res.status(422).json({
              status: 'failed',
              code: '422',
              data: {
                title: 'User credentials are not correct'
              }
            });
          } else {
            const token = jwt.sign(
              {
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
              },
              'reactJsmessengerapp',
              { 
                expiresIn: '24h' // expires in 24 hours
              }
            );
            user.token = token;
            user.save();
            return res.status(200).json({
              status: 'success',
              code: '200',
              data: {
                token: token,
                user: user
              }
            });
          }
        })
        .catch(err => {
          return error(res);
        })
    })
    .catch(err => {
      return error(res);
    });
}

let checkToken = (req, res, next) => {
  let token = req.headers['authorization'];
  const jwt = require('jsonwebtoken');
  if (token) {
    jwt.verify(token, 'reactJsmessengerapp', (err, decoded) => {
      if (err) {
        return res.json({
          success: false,
          message: 'Token is not valid'
        });
      } else {
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.json({
      success: false,
      message: 'Auth token is not supplied'
    });
  }
};

let index =  (req, res) => {
  res.json({
    success: true,
    message: 'Index page'
  });
}

//handle user login by token
var login_with_token = (req, res, next) => {
  if(!req.headers || !req.headers.authorization) {
    return error(res);
  }
  User.findOne({'token': req.headers.authorization}).exec()
    .then(user => {
      if (!user) {
        return error(res);
      } else {
        return res.json({
          status: 'success',
          code: '200',
          user: user
        });
      }
    })
    .catch(err => {
      return error(res);
    });
}

module.exports = {
  login : login, 
  signup : signup,
  checkToken: checkToken,
  index : index, 
  login_with_token : login_with_token
}
