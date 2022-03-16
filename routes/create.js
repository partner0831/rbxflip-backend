//@import models
const Room = require("../models/Room");

//@import util
const isEmpty = require("../utils/is-Empty");

const create = async (socket) => {
  socket.on("createRoom", async (item) => {
    const roomData = new Room({
      creator: item.creator,
      nftinfo: item.nftdata,
    });
    roomData
      .save()
      .then((item) => {
        socket.emit("create_success", { item, msg: "success" });
      })
      .catch((err) => {
        socket.emit("create_failed", { err, msg: "success" });
      });
  });
};
module.exports = { create };
