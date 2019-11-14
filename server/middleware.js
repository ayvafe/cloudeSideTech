let jwt = require('jsonwebtoken');
const config = require('./config.js');

let checkToken = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase

  if (token) {
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }
    jwt.verify(token, config.secret, (err, decoded) => {
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

let getRoomsList = (req, res, next) => {
  try {
    let rList = config.read("./rooms.json");
    delete rList.list;
    return res.json({
      success: ture,
      rooms : rList, 
    });
  } catch (e){
    return res.json({
      success: false,
      message: 'Something went wrong'
    });
  }
};

module.exports = {
  checkToken: checkToken,
  getRoomsList : getRoomsList 
}
