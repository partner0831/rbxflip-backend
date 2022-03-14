const mongoose = require("mongoose");

const ExchangeSchema = new mongoose.Schema({
  price: {
    type: Number,
  },
  stack_rate: {
    type: Number,
  },
  referral_rate: {
    type: Number,
  },
  swap_rate: {
    type: Number,
  },
  withdraw_rate: {
    type: Number,
  },
  minium_amount: {
    type: Number,
  },
  admin_address: {
    type: String,
  },
});

module.exports = mongoose.model("price", ExchangeSchema);
