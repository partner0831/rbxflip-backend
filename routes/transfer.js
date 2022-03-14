const express = require("express");
const router = express.Router();
//@import models
const User = require("../models/User");
const History = require("../models/History");
const passport = require("passport");
//@import validation
const validateTransferInput = require("../validation/transfer");
// @route   GET users/test
// @desc
// @access  Public
router.get("/test", (req, res) => {});
// @route   POST users/test
// @desc    Transfer HDT
// @access  private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { errors, isValid } = validateTransferInput(req.body);
    const { owneraddress, toaddress, flag, amount } = req.body;

    if (amount <= 0) {
      return res.status(400).send({
        amount: "please input correct amount",
      });
    }
    if (!isValid) {
      return res.status(400).send(errors);
    }
    const owner = await User.findOne({ address: owneraddress });
    const sender = await User.findOne({ address: toaddress });

    if (owner && sender) {
      if (flag === "eth") {
        if (owner.countETH >= amount) {
          owner.countETH = owner.countETH - amount;
          sender.countETH = sender.countETH + amount;
          owner
            .save()
            .then((item) => {
              return res.status(200).json({ msg: "success" });
            })
            .catch((err) => {
              return res.status(400).json({ errors: err });
            });
          sender
            .save()
            .then((item) => {
              return res.status(200).json({ msg: "success" });
            })
            .catch((err) => {
              return res.status(400).json({ errors: err });
            });
          const newHistory = new History({
            method: flag,
            from_address: owneraddress,
            to_address: toaddress,
            amount: amount,
            type: 3,
          });
          newHistory.save();
        } else {
          return res.status(400).send({
            amount: "Not Sufficient Balance",
          });
        }
      } else if (flag === "hdt") {
        if (owner.countHDT >= amount) {
          owner.countHDT = owner.countHDT - amount;
          sender.countHDT = sender.countHDT + amount;
          owner
            .save()
            .then((item) => {
              return res.status(200).json({ msg: "success" });
            })
            .catch((err) => {
              return res.status(400).json({ errors: err });
            });
          sender
            .save()
            .then((item) => {
              return res.status(200).json({ msg: "success" });
            })
            .catch((err) => {
              return res.status(400).json({ errors: err });
            });
          const newHistory = new History({
            method: flag,
            from_address: owneraddress,
            to_address: toaddress,
            amount: amount,
            type: 3,
          });
          newHistory.save();
        } else {
          return res.status(400).send({
            amount: "Not Sufficient Balance",
          });
        }
      }
    } else {
      return res.status(400).send({ address: "please input correct address" });
    }

    // .catch((err) => {
    //     return res.status(400).json({ errors: err });
    //   });
  }
);
module.exports = router;
