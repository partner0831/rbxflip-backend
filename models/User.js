const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  countHDT: {
    type: Number,
    required: true,
    default: 0,
  },
  countUSDT: {
    type: Number,
    required: true,
    default: 0,
  },
  address: {
    type: String,
    required: true,
  },
  privateKey: {
    type: String,
    required: true,
  },
  countETH: {
    type: Number,
    required: true,
    default: 0,
  },
  referralcode: {
    type: String,
  },
  owncode: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: "user",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  allow_send: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("user", UserSchema);
