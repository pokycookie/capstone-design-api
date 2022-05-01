const mongoose = require("mongoose");
const { decrypt } = require("../crypto");
const Schema = mongoose.Schema;

/*
---------------------------------------------
securityLevel: 0 ~ 3
level 0: all permission + can create User
level 1: can update DB data
level 2: can see all DB data
level 3: can only see own DB data
---------------------------------------------
*/

const userSchema = new Schema({
  id: {
    type: String,
    required: true,
    trim: true,
  },
  key: {
    type: String,
    required: true,
    trim: true,
  },
  salt: {
    type: String,
    required: true,
    trim: true,
  },
  nickname: {
    type: String,
    required: true,
  },
  updated: {
    type: Date,
    required: true,
  },
  created: {
    type: Date,
    required: true,
  },
  securityLevel: {
    type: Number,
    required: true,
  },
});

userSchema.methods.comparePassword = async function (salt, inputPW, callback) {
  if ((await decrypt(salt, inputPW)) === this.key) {
    callback(null, true);
  } else {
    callback("The password is incorrect", false);
  }
};

module.exports = mongoose.model("User", userSchema);
