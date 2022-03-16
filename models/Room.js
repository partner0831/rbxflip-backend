const mongoose = require("mongoose");
const RoomSchema = new mongoose.Schema({
  creator: {
    type: String,
    required: true,
  },
  nftinfo: {
    type: Array,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("room", RoomSchema);
