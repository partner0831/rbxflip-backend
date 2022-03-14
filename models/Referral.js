const mongoose = require("mongoose");

const ReferralSchema = new mongoose.Schema({
  address: {
    type: String,
    require: true,
  },
  referral_amount: {
    type: Number,
    require: true,
  },
});

module.exports = mongoose.model("referral", ReferralSchema);
