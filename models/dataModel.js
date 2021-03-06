const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dataSchema = new Schema({
  location: {
    type: Number,
    required: true,
    trim: true,
  },
  sound: {
    type: Number,
    required: true,
    trim: true,
  },
  vibration: {
    type: Number,
    required: true,
    trim: true,
  },
  updated: {
    type: Date,
    required: true,
  },
  getSound: {
    type: Number,
  },
  postSound: {
    type: Number,
  },
});

module.exports = mongoose.model("Data", dataSchema);
