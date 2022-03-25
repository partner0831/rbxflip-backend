const mongoose = require("mongoose");
const RoomSchema = new mongoose.Schema({
  creator: {
    type: String,
    required: true,
  },
  visitor: {
    type: String,
  },
  nftinfo: {
    type: Array,
  },
  visitinfo: {
    type: Array,
  },
  creatorReady: {
    type: Boolean,
    require: true,
    default: false,
  },
  visitorReady: {
    type: Boolean,
    require: true,
    default: false,
  },
  winner: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  choose: {
    type: Boolean,
    require: true,
    default: false,
  },
});

module.exports = mongoose.model("room", RoomSchema);
