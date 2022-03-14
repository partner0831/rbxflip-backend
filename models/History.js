const mongoose = require("mongoose");

const HistorySchema = new mongoose.Schema({
  method: {
    type: String,
    required: true,
  },
  to_address: {
    type: String,
    required: true,
  },
  from_address: {
    type: String,
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: Number, //1=deposit,2=withdraw,3=tranfer,4=hourly_stack,5=swapped,6=referral,7=complete
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("history", HistorySchema);
