const express = require("express");
const router = express.Router();
const passport = require("passport");
const moment = require("moment");
//@import models
const Stack = require("../models/Stacking");
const Exchange = require("../models/Exchange");
const User = require("../models/User");
const History = require("../models/History");
//@import validataion
const validateStack = require("../validation/stack");
const validateEarn = require("../validation/earn");
//@import util
const isEmpty = require("../utils/is-Empty");
// @route   GET stack/test
// @desc    Return current user
// @access  Public
router.get("/test", (req, res) => {});

// @route   POST stack
// @desc    stack HDT
// @access  private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { errors, isValid } = validateStack(req.body);
    const { ID, amount, duration } = req.body;
    if (!isValid) {
      return res.status(400).send(errors);
    }
    if (amount <= 0 || duration <= 0) {
      return res.status(400).send({
        stackamount: "please input correct amount",
      });
    }
    const date = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
      new Date().getHours(),
      new Date().getMinutes(),
      0
    );
    const person = await User.findOne({ _id: ID });
    const value = await Exchange.findOne({});
    if (person) {
      if (person.countHDT >= amount) {
        if (isEmpty(value.minium_amount)) {
          return res.status(400).send({
            stackamount: "Minimum amount is not setted",
          });
        } else {
          if (value.minium_amount <= amount) {
            const newData = new Stack({
              user: ID,
              stack_amount: amount,
              date: date,
              currentDate: date,
              end_date: moment(date).add(duration, "days"),
            });

            person.countHDT = person.countHDT - amount;

            const newHistory = new History({
              method: "hdt",
              to_address: person.address,
              amount: amount,
              type: 8,
            });
            const newStackF = await newData.save();
            const newPersonF = await person.save();
            const newHistoryF = await newHistory.save();
            if (newStackF && newPersonF && newHistoryF) {
              return res.status(200).json({ msg: "success" });
            }
          } else {
            return res.status(400).send({
              stackamount: "You have to stake more than Minimum amount",
            });
          }
        }
      } else {
        return res.status(400).send({
          stackamount: "Not Sufficient Balance",
        });
      }
    } else {
      return res.status(400).send({
        errors: "user not found",
      });
    }
  }
);
// @route   Get stake info by user
// @access  private
router.post(
  "/getStake",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { errors, isValid } = validateEarn(req.body);

    const { ID } = req.body;

    if (!isValid) {
      return res.status(400).send(errors);
    }
    Stack.find({ user: ID, flag: true })
      .then((item) => {
        return res.status(200).json(item);
      })
      .catch((err) => {
        return res.status(400).json({ errors: err });
      });
  }
);

// @route   Get stake info by id
// @access  private
router.put(
  "/getStake",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { errors, isValid } = validateEarn(req.body);

    const { ID } = req.body;
    if (!isValid) {
      return res.status(400).send(errors);
    }
    Stack.findOne({ _id: ID, flag: true })
      .then((item) => {
        return res.status(200).json(item);
      })
      .catch((err) => {
        return res.status(400).json({ errors: err });
      });
  }
);

module.exports = router;
