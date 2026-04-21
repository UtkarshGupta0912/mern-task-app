const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  completed: { type: Boolean, default: false },
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // links task to a user
}, { timestamps: true }); // auto adds createdAt, updatedAt

module.exports = mongoose.model('Task', TaskSchema);