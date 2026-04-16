const mongoose = require('mongoose');

const boardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  background: {
    type: String,
    default: '#0079BF'  // default Trello-like blue
  }
}, { timestamps: true });

module.exports = mongoose.model('Board', boardSchema);