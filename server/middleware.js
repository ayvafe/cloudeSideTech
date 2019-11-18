const Room = require('./room.js');
const RoomsJson = require('./rooms.json');

getMessages = () => {
  Rooms.find({'roomId': roomId}).sort('-date').limit(15).exec(function(err, posts){
    console.log("Emitting Update...");
    socket.emit("Update", posts.length);
    console.log("Update Emmited");
  });
}

let getRoomsList = (req, res, next) => {
  Room.find({}).exec()
    .then(response => {
      if (!response) {
        return res.status(500).json({
          status: 'error',
          code : '500',
          data : 'Something is wrong. Please try again later.'
        });
      } else {
        return res.json({
          status: 'success',
          code: '200',
          rooms : response
        });
      }
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({
        status: 'error',
        code : '500',
        data : 'Something is wrong. Please try again later.'
      });
    });
};

//Generating uinique ID for each WebSocket client
let getUniqueID = () => {
  const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  return s4() + s4() + '-' + s4();
};

let importRoomsIntoDb = () => {
  //TODO create new room option
  if(RoomsJson.length < 0) {
    const r = new Room();
    r._id = new mongoose.Types.ObjectId();
    r.save();
    return;
  }
  try {
    Object.keys(RoomsJson).forEach(function (key) {
      const item = RoomsJson[key].room;
      let newRoom = new Room();
      newRoom._id = new mongoose.Types.ObjectId();
      if (item != null) {
        Room.findOne({'name': item.name}).exec()
          .then( room => {
            if(room != null){
              return;
            } else {
              let id = getUniqueID();
              newRoom.name = item.name ? item.name : id;
              newRoom.save();
            }
          })
      }
    })
  } catch (err) {
    console.log(" ERROR while importing rooms data : " + err);
  };
}

module.exports = {
  getRoomsList : getRoomsList,
  getMessages : getMessages,
  importRoomsIntoDb : importRoomsIntoDb ,
}
