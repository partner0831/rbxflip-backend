const express = require("express");
const router = express.Router();
//@import models
const History = require("../models/History");

router.get("/", (req, res) => {
  History.find({})
    .then((item) => {
      return res.status(200).json(item);
    })
    .catch((err) => {
      return res.status(404).json(err);
    });
});

router.post("/", (req, res) => {
  const { address } = req.body;
  History.find({
    $or: [{ from_address: address }, { to_address: address }],
  })
    .sort({ date: -1 })
    .then((item) => {
      // console.log(item);
      return res.status(200).json(item);
    })
    .catch((err) => {
      return res.status(404).json(err);
    });
});

router.post("/gethistory", (req, res) => {
  const { address } = req.body;
  History.find({
    $or: [{ from_address: address }, { to_address: address }],
    type: 3,
  })
    .then((item) => {
      return res.status(200).json(item);
    })
    .catch((err) => {
      return res.status(404).json(err);
    });
});

module.exports = router;
