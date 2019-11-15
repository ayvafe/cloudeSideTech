const Schema = mongoose.Schema;

const schema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  currentRoomId : {
    type: String,
    required: false 
  },
  password: {
    type: String,
    required: true
  },
  socket_id: {
    type: String,
    required: false 
  }
});

module.exports = mongoose.model('User', schema);
