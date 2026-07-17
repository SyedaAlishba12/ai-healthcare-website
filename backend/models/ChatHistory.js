const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant'],
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const chatHistorySchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    messages: [messageSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('ChatHistory', chatHistorySchema);
