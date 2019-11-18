const Schema = mongoose.Schema;

const schema = new Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    default: 'Dafault',
    required: false 
  }
}, {
  collection: 'Room'
});

module.exports = mongoose.model('Room', schema);
