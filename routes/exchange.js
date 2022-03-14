const express = require("express");
const passport = require("passport");
const router = express.Router();
//@import model
const Exchange = require("../models/Exchange");
//@import validataion
const validatePrice = require("../validation/price");
//@import util
const isEmpty = require("../utils/is-Empty");
var nodeEth = require("node-eth-address");
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { errors, isValid } = validatePrice(req.body);
    const { amount, label } = req.body;
    if (!isValid) {
      return res.status(400).send(errors);
    }
    if (amount <= 0) {
      return res.status(400).send({ countETH: "please input correct" });
    }
    if (label === "admin_address") {
      if (!nodeEth.validateAddress(amount)) {
        return res.status(400).json({ amount: "Address in not valid" });
      }
    }

    Exchange.findOne({})
      .then((item) => {
        if (!isEmpty(item)) {
          if (label === "price") {
            item.price = amount;
            item
              .save()
              .then((item) => {
                return res.status(200).json({ msg: "success" });
              })
              .catch((err) => {
                return res.status(400).json({ errors: err });
              });
          }
          if (label === "stack_rate") {
            item.stack_rate = amount;
            item
              .save()
              .then((item) => {
                return res.status(200).json({ msg: "success" });
              })
              .catch((err) => {
                return res.status(400).json({ errors: err });
              });
          }
          if (label === "referral_rate") {
            item.referral_rate = amount;
            item
              .save()
              .then((item) => {
                return res.status(200).json({ msg: "success" });
              })
              .catch((err) => {
                return res.status(400).json({ errors: err });
              });
          }
          if (label === "swap_rate") {
            item.swap_rate = amount;
            item
              .save()
              .then((item) => {
                return res.status(200).json({ msg: "success" });
              })
              .catch((err) => {
                return res.status(400).json({ errors: err });
              });
          }
          if (label === "withdraw_rate") {
            item.withdraw_rate = amount;
            item
              .save()
              .then((item) => {
                return res.status(200).json({ msg: "success" });
              })
              .catch((err) => {
                return res.status(400).json({ errors: err });
              });
          }
          if (label === "minium_amount") {
            item.minium_amount = amount;
            item
              .save()
              .then((item) => {
                return res.status(200).json({ msg: "success" });
              })
              .catch((err) => {
                return res.status(400).json({ errors: err });
              });
          }
          if (label === "admin_address") {
            item.admin_address = amount;
            item
              .save()
              .then((item) => {
                return res.status(200).json({ msg: "success" });
              })
              .catch((err) => {
                return res.status(400).json({ errors: err });
              });
          }
        } else {
          if (label === "price") {
            const newData = new Exchange({
              price: amount,
            });

            newData
              .save()
              .then((item) => {
                return res.status(200).json({ msg: "success" });
              })
              .catch((err) => {
                return res.status(400).json({ errors: err });
              });
          }
          if (label === "stack_rate") {
            const newData = new Exchange({
              stack_rate: amount,
            });

            newData
              .save()
              .then((item) => {
                return res.status(200).json({ msg: "success" });
              })
              .catch((err) => {
                return res.status(400).json({ errors: err });
              });
          }
          if (label === "referral_rate") {
            const newData = new Exchange({
              referral_rate: amount,
            });

            newData
              .save()
              .then((item) => {
                return res.status(200).json({ msg: "success" });
              })
              .catch((err) => {
                return res.status(400).json({ errors: err });
              });
          }
          if (label === "swap_rate") {
            const newData = new Exchange({
              swap_rate: amount,
            });

            newData
              .save()
              .then((item) => {
                return res.status(200).json({ msg: "success" });
              })
              .catch((err) => {
                return res.status(400).json({ errors: err });
              });
          }
          if (label === "withdraw_rate") {
            const newData = new Exchange({
              withdraw_rate: amount,
            });

            newData
              .save()
              .then((item) => {
                return res.status(200).json({ msg: "success" });
              })
              .catch((err) => {
                return res.status(400).json({ errors: err });
              });
          }
          if (label === "minium_amount") {
            const newData = new Exchange({
              minium_amount: amount,
            });

            newData
              .save()
              .then((item) => {
                return res.status(200).json({ msg: "success" });
              })
              .catch((err) => {
                return res.status(400).json({ errors: err });
              });
            if (label === "admin_address") {
              const newData = new Exchange({
                admin_address: amount,
              });

              newData
                .save()
                .then((item) => {
                  return res.status(200).json({ msg: "success" });
                })
                .catch((err) => {
                  return res.status(400).json({ errors: err });
                });
            }
          }
        }
      })
      .catch((err) => {
        return res.status(400).json({ errors: err });
      });
  }
);

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Exchange.findOne()
      .then((item) => {
        return res.status(200).json(item);
      })
      .catch((err) => {
        return res.status(400).json({ errors: err });
      });
  }
);
module.exports = router;
