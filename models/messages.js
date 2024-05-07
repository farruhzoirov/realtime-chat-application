const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  message: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  writtenHour: {
    type: String,
    required: true,
  },
  writtenMinute: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('message', messageSchema);
