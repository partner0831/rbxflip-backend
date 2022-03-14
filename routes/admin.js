const express = require("express");
//@import models
const Withdraw = require("../models/Withdraw");
const History = require("../models/History");
const User = require("../models/User");
const approve = async (socket) => {
  socket.on("approve", async (item) => {
    const { id, amount, flag, address } = item;
    Withdraw.findByIdAndUpdate(
      id,
      { $set: { status: 1, date: Date.now() } },
      { new: true }
    )
      .then(async (item) => {
        const newHistory = new History({
          method: flag,
          to_address: address,
          amount: amount,
          type: 2,
        });
        const hisFlag = await newHistory.save();
        if (hisFlag) {
          socket.emit("app_transaction", item);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
};
const reject = async (socket) => {
  socket.on("reject", async (item) => {
    const data = await Withdraw.findById(item._id);
    if (data) {
      Withdraw.findByIdAndRemove(item._id)
        .then(async () => {
          const user = await User.findOne({ address: item.user.address });
          if (item.method === "eth") {
            user.countETH = user.countETH + item.amount;
          } else if (item.method === "hdt") {
            user.countHDT = user.countHDT + item.amount;
          } else if (item.method === "usdt") {
            user.countUSDT = user.countUSDT + item.amount;
          }
          user
            .save()
            .then(() => {
              socket.emit("rej_transaction", item.user._id);
            })
            .catch((err) => {
              return res.status(404).json(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
};

module.exports = { approve, reject };
