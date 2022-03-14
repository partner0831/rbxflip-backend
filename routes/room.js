const express = require("express");
const router = express.Router();
//@import models
const Room = require("../models/Room");
// @route   GET users/test
// @desc    Return current user
// @access  Public
router.get("/test", (req, res) => {
  return res.json({ msg: "okay" });
});
// @route   GET users/all
// @desc    Return all room info
// @access  Public
router.get("/all", (req, res) => {
  Room.find({})
    .then((item) => {
      return res.status(200).json(item);
    })
    .catch((err) => {
      return res.status(404).json(err);
    });
});

module.exports = router;
