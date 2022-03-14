//@import models
const User = require("../models/User");
const History = require("../models/History");
const Exchange = require("../models/Exchange");
//@import util
const isEmpty = require("../utils/is-Empty");
const axios = require("axios");

const deposit = async (socket) => {
  socket.on("deposit", async (item) => {
    const { id, address, flag, amount } = item;
    const userdata = await User.findById(id);
    const value = await Exchange.findOne({});
    if (userdata) {
      if (flag === "eth") {
        userdata.countETH = userdata.countETH + amount;
      } else if (flag === "hdt") {
        userdata.countHDT = userdata.countHDT + amount;
      }
      const ethPrice = await axios.get(
        "https://api.binance.com/api/v3/ticker/24hr?symbol=ETHUSDT"
      );
      userdata
        .save()
        .then(async (item) => {
          const newHistory = new History({
            method: flag,
            to_address: address,
            amount: amount,
            type: 1,
          });
          const data = {
            amount,
            address,
            flag,
          };
          const hisFlag = await newHistory.save();
          if (hisFlag) {
            socket.emit("success_deposit", data);
          }

          if (item.referralcode && flag === "eth") {
            const selectedUser = await User.findOne({
              owncode: item.referralcode,
            });
            if (isEmpty(value.referral_rate)) {
              socket.emit("failed_deposit", {
                err: "referral_rate is not setted",
              });
            }
            if (selectedUser) {
              const balance =
                ((ethPrice.data.weightedAvgPrice * amount) / 100) *
                value.referral_rate;
              selectedUser.countUSDT = selectedUser.countUSDT + balance;
              const sendUser = {
                address: selectedUser.address,
                balance,
              };
              const newHistory = new History({
                method: "usdt",
                to_address: selectedUser.address,
                amount: balance,
                type: 6,
              });
              const selUser = await selectedUser.save();
              const refUser = await newHistory.save();

              if (selUser && refUser) {
                socket.emit("referral_deposit", sendUser);
              }
            }
          }
        })
        .catch((err) => {
          socket.emit("failed_deposit", err);
        });
    } else {
      return res.status(400).send({
        err: "User not found",
      });
    }
  });
};

const tranferCrypto = async (socket, onlineUsers) => {
  socket.on("transfer", async (item) => {
    const { owneraddress, toaddress, flag, amount } = item;
    if (amount <= 0) {
      socket.emit("failed_transfer", { amount: "please input correct amount" });
    }
    if (owneraddress === toaddress) {
      socket.emit("failed_transfer", {
        address: "Please input another address",
      });
    } else {
      const owner = await User.findOne({ address: owneraddress });
      const sender = await User.findOne({ address: toaddress });

      if (owner && sender) {
        if (flag === "eth") {
          if (owner.countETH >= amount) {
            owner.countETH = owner.countETH - amount;
            sender.countETH = sender.countETH + amount;
            const ownFlag = await owner.save();
            const sendFlag = await sender.save();
            const newHistory = new History({
              method: flag,
              from_address: owneraddress,
              to_address: toaddress,
              amount: amount,
              type: 3,
            });
            const historyFlag = await newHistory.save();
            if (ownFlag && sendFlag && historyFlag) {
              const data = {
                id: ownFlag._id,
                sender: sendFlag._id,
                owner: owneraddress,
                user: toaddress,
                amount: amount,
                method: flag,
              };
              socket.emit("sent_money", data);
              socket
                .to(onlineUsers[sendFlag._id])
                .emit("complete_transfer", data);
            }
          } else {
            socket.emit("failed_transfer", {
              amount: "Not Sufficient Balance",
            });
          }
        } else if (flag === "hdt") {
          if (owner.countHDT >= amount) {
            owner.countHDT = owner.countHDT - amount;
            sender.countHDT = sender.countHDT + amount;
            const ownFlag = await owner.save();
            const sendFlag = await sender.save();

            const newHistory = new History({
              method: flag,
              from_address: owneraddress,
              to_address: toaddress,
              amount: amount,
              type: 3,
            });
            const historyFlag = await newHistory.save();

            if (ownFlag && sendFlag && historyFlag) {
              const data = {
                id: ownFlag._id,
                sender: sendFlag._id,
                owner: owneraddress,
                user: toaddress,
                amount: amount,
                method: flag,
              };
              socket.emit("sent_money", data);
              socket
                .to(onlineUsers[sendFlag._id])
                .emit("complete_transfer", data);
            }
          } else {
            socket.emit("failed_transfer", {
              amount: "Not Sufficient Balance",
            });
          }
        }
      } else {
        socket.emit("failed_transfer", {
          address: "Address does not exist.",
        });
      }
    }
  });
};

module.exports = { deposit, tranferCrypto };
