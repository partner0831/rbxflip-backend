const express = require("express");
const router = express.Router();
//@import models
const User = require("../models/User");
const Exchange = require("../models/Exchange");
const History = require("../models/History");
//@import validation
const validateSwap = require("../validation/swap");
//@import util
const isEmpty = require("../utils/is-Empty");

// @route   GET users/test
// @desc    Return current user
// @access  Public
router.post("/test", async (req, res) => {
  console.log(nodeEth.validateAddress(req.body.address));
});
// @route   POST swap/swaptohdt
// @desc    SWAP ETH to HDT
// @access  private
router.post("/swaptohdt", async (req, res) => {
  const { errors, isValid } = validateSwap(req.body);
  const { ID, amount, price } = req.body;

  if (!isValid) {
    return res.status(400).send(errors);
  }
  if (amount <= 0) {
    return res.status(400).send({ countETH: "please input correct" });
  }
  const hdtitem = await Exchange.findOne({});
  const person = await User.findOne({ _id: ID });
  if (person && hdtitem) {
    if (person.countETH >= amount) {
      if (isEmpty(hdtitem.price)) {
        return res.status(400).send({
          countETH: "ETH price is not setted",
        });
      } else {
        person.countETH = person.countETH - amount;
        person.countHDT = person.countHDT + (amount * price) / hdtitem.price;
        person
          .save()
          .then((item) => {
            const newHistory = new History({
              method: "eth",
              to_address: item.address,
              amount: amount,
              type: 5,
            });
            newHistory.save();
            return res.status(200).json({ msg: "success" });
          })
          .catch((err) => {
            return res.status(400).json({ errors: err });
          });
      }
    } else {
      return res.status(400).send({
        countETH: "Not Sufficient Balance",
      });
    }
  } else {
    return res.status(400).json({ address: "address is not correct" });
  }
});
// @route   POST swap/swaptoeth
// @desc    SWAP HDT to ETH
// @access  private
router.post("/swaptoeth", async (req, res) => {
  const { errors, isValid } = validateSwap(req.body);
  const { ID, amount, price } = req.body;
  if (!isValid) {
    return res.status(400).send(errors);
  }
  if (amount <= 0) {
    return res.status(400).send({ countHDT: "please input correct" });
  }
  const hdtitem = await Exchange.findOne({});
  const person = await User.findOne({ _id: ID });
  if (person && hdtitem) {
    if (person.countHDT >= amount) {
      if (isEmpty(hdtitem.minium_amount)) {
        return res.status(400).send({
          error: "Minimum amount is not setted",
        });
      } else if (isEmpty(hdtitem.price)) {
        return res.status(400).send({
          error: "HDT price is not setted",
        });
      } else {
        person.countHDT = person.countHDT - amount;
        person.countETH =
          person.countETH +
          (((amount * hdtitem.price) / price) * hdtitem.swap_rate) / 100;
        person
          .save()
          .then((item) => {
            const newHistory = new History({
              method: "hdt",
              to_address: item.address,
              amount: amount,
              type: 5,
            });
            newHistory.save();
            return res.status(200).json({ msg: "success" });
          })
          .catch((err) => {
            return res.status(400).json({ errors: err });
          });
      }
    } else {
      return res.status(400).send({
        countHDT: "Not Sufficient Balance",
      });
    }
  } else {
    return res.status(400).json({ address: "address is not correct" });
  }
});
module.exports = router;
