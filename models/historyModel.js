const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const historySchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  month: {
    type: Number,
    required: true,
  },
  date: {
    type: Number,
    required: true,
  },
  updated: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("History", historySchema);
