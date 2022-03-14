const express = require("express");
const passport = require("passport");
const router = express.Router();
//@import Model
const Referral = require("../models/Referral");

router.post(
  "/getreferral",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    const { address } = req.body;
    Referral.find({ address })
      .then((item) => {
        return res.status(200).json(item);
      })
      .catch((err) => {
        return res.status(404).json(err);
      });
  }
);

module.exports = router;
