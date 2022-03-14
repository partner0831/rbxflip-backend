const mongoose = require("mongoose");
const HistorySchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
  },
  nftinfo: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("history", HistorySchema);
