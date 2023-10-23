const mongoose = require("mongoose");

// Demo User  Modal Schema
const usersSchema = new mongoose.Schema({
  userId: { type: String, require: true },
  name: { type: String, require: true },
  email: { type: String, require: true },
  isVerified: { type: Boolean, default: false },
  password: String,
  date: { type: String, default: null },
});

// Task Modal Schema
const taskSchema = new mongoose.Schema({
  title: { type: String, require: true },
  description: { type: String, require: true },
  status: { type: Boolean, Default: false }, // false means inprogress and true is completed
  userId: { type: String, require: true },
});

const users = mongoose.model("users", usersSchema);
const task = mongoose.model("task", taskSchema);

// Exporting our model objects
module.exports = {
  users,
  task,
};
