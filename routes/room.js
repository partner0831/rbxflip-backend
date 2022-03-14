const express = require("express");
const router = express.Router();

// @route   GET users/test
// @desc    Return current user
// @access  Public
router.get("/test", (req, res) => {
  return res.json({ msg: "okay" });
});
module.exports = router;
