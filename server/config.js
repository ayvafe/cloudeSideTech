const fs = require('fs');

module.exports = {
  server : '127.0.0.1:27018',
  database : 'messenger-app',
  secret: 'worldisfullofdevelopers',

  read : function (n) {
    fs.readFile(n, function (err, data) {
      console.log()
      if (err){
        throw err
        console.log("Error while reading " +  n + " file. Error message is : " + err);
      }
      let t = {};
      try {
        t = JSON.parse(data)
      } catch (e) {
        console.log(e + ' ' + n);
      }
      return t;
    })
  },

  write : function (json, n) {
    fs.writeFile(n, JSON.stringify(json), function(err){
      if (err){
        throw err
        console.log("Error while writeing to " +  n + " file. Error message is : " + err);
      }
    });
  }
};
