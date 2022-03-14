const mongoose = require("mongoose");

const EarnSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  amount: {
    type: Number,
    require: true,
  },
});

module.exports = mongoose.model("earn", EarnSchema);
