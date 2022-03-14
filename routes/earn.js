const express = require("express");
const passport = require("passport");
const router = express.Router();
//@import validataion
const validateEarn = require("../validation/earn");
//@import Model
const Earn = require("../models/Earn");

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    // const { errors, isValid } = validateEarn(req.body);
    //   const { ID } = req.body;
    // if (!isValid) {
    //   return res.status(400).send(errors);
    // }
    const newData = new Earn({
      user: "61028e9817adaf049c951296",
      amount: 1000,
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
);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { errors, isValid } = validateEarn(req.body);
    const { ID } = req.body;
    if (!isValid) {
      return res.status(400).send(errors);
    }
    Earn.findOne({ user: ID })
      .then((item) => {
        return res.status(200).json(item);
      })
      .catch((err) => {
        return res.status(400).json({ errors: err });
      });
  }
);

module.exports = router;
