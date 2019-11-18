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
    default: 'dafault',
    required: false 
  },
  password: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: false 
  }
}, {
  collection: 'User'
});

module.exports = mongoose.model('User', schema);
