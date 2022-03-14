const mongoose = require("mongoose");
const WithdrawSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  address: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },

  method: {
    type: String,
    required: true,
  },
  status: {
    type: Number, //pending=3,reject=2,success=1
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("withdraw", WithdrawSchema);
