//@import models
const Room = require("../models/Room");

//@import util
const isEmpty = require("../utils/is-Empty");

const createRoom = async (socket) => {
  socket.on("createRoom", async (item) => {
    const roomData = new Room({
      creator: item.creator,
      nftinfo: item.nftdata,
    });

    roomData
      .save()
      .then(async (item) => {
        socket.emit("create_success", { item, msg: "success" });
        socket.broadcast.emit("create_success", { item, msg: "success" });
      })
      .catch((err) => {
        socket.emit("create_failed", { err, msg: "failed" });
      });
  });
};
const joinRoom = async (socket) => {
  socket.on("joinRoom", async (item) => {
    Room.findByIdAndUpdate(
      item.roomId,
      { $set: { visitor: item.visitor, visitinfo: item.nftdata } },
      { new: true }
    )
      .then((item) => {
        socket.emit("join_success", { item, msg: "success" });
        socket.broadcast.emit("join_success", { item, msg: "success" });
      })
      .catch((err) => {
        console.log(err);
        socket.emit("join_failed", { err, msg: "failed" });
      });
  });
};
const readyEvent = async (socket) => {
  socket.on("ready_player", async (item) => {
    const data = await Room.findById(item.item._id);
    if (!data.creatorReady && !data.visitorReady) {
      if (item.creator) {
        Room.findByIdAndUpdate(
          item.item._id,
          { $set: { creatorReady: true } },
          { new: true }
        )
          .then((item) => {
            socket.emit("ready_success", { item, msg: "success" });
            socket.broadcast.emit("ready_success", { item, msg: "success" });
          })
          .catch((err) => {
            socket.emit("ready_failed", { err, msg: "failed" });
          });
      } else if (item.visitor) {
        Room.findByIdAndUpdate(
          item.item._id,
          { $set: { visitorReady: true } },
          { new: true }
        )
          .then((item) => {
            socket.emit("ready_success", { item, msg: "success" });
            socket.broadcast.emit("ready_success", { item, msg: "success" });
          })
          .catch((err) => {
            socket.emit("ready_failed", { err, msg: "failed" });
          });
      }
    } else {
      const creatorNum = data.nftinfo.reduce(
        (total, currentValue) =>
          (total = total + currentValue.last_sale.total_price / 10 ** 18),
        0
      );
      const visitorNum = data.visitinfo.reduce(
        (total, currentValue) =>
          (total = total + currentValue.last_sale.total_price / 10 ** 18),
        0
      );
      if (creatorNum === visitorNum) {
        if (Math.floor(Math.random() * 10) % 2) {
          Room.findByIdAndUpdate(
            item.item._id,
            {
              $set: {
                creatorReady: true,
                visitorReady: true,
                winner: item.item.creator,
              },
            },
            { new: true }
          )
            .then((item) => {
              socket.emit("ready_success", { item, msg: "success" });
              socket.broadcast.emit("ready_success", { item, msg: "success" });
            })
            .catch((err) => {
              socket.emit("ready_failed", { err, msg: "failed" });
            });
        } else {
          Room.findByIdAndUpdate(
            item.item._id,
            {
              $set: {
                creatorReady: true,
                visitorReady: true,
                winner: item.item.visitor,
              },
            },
            { new: true }
          )
            .then((item) => {
              socket.emit("ready_success", { item, msg: "success" });
              socket.broadcast.emit("ready_success", { item, msg: "success" });
            })
            .catch((err) => {
              console.log(err);
              socket.emit("ready_failed", { err, msg: "failed" });
            });
        }
      } else {
        const baseNum = Math.random();
        if (baseNum === creatorNum || baseNum === visitorNum) {
          if (Math.floor(baseNum * 10) % 2) {
            Room.findByIdAndUpdate(
              item.item._id,
              {
                $set: {
                  creatorReady: true,
                  visitorReady: true,
                  winner: item.item.creator,
                },
              },
              { new: true }
            )
              .then((item) => {
                socket.emit("ready_success", { item, msg: "success" });
                socket.broadcast.emit("ready_success", {
                  item,
                  msg: "success",
                });
              })
              .catch((err) => {
                console.log(err);
                socket.emit("ready_failed", { err, msg: "failed" });
              });
          } else {
            Room.findByIdAndUpdate(
              item.item._id,
              {
                $set: {
                  creatorReady: true,
                  visitorReady: true,
                  winner: item.item.visitor,
                },
              },
              { new: true }
            )
              .then((item) => {
                socket.emit("ready_success", { item, msg: "success" });
                socket.broadcast.emit("ready_success", {
                  item,
                  msg: "success",
                });
              })
              .catch((err) => {
                console.log(err);
                socket.emit("ready_failed", { err, msg: "failed" });
              });
          }
        } else {
          const baseNum = Math.random();
          if (baseNum < creatorNum / (creatorNum + visitorNum)) {
            Room.findByIdAndUpdate(
              item.item._id,
              {
                $set: {
                  creatorReady: true,
                  visitorReady: true,
                  winner: item.item.creator,
                },
              },
              { new: true }
            )
              .then((item) => {
                socket.emit("ready_success", { item, msg: "success" });
                socket.broadcast.emit("ready_success", {
                  item,
                  msg: "success",
                });
              })
              .catch((err) => {
                console.log(err);
                socket.emit("ready_failed", { err, msg: "failed" });
              });
          } else if (baseNum > creatorNum / (creatorNum + visitorNum)) {
            Room.findByIdAndUpdate(
              item.item._id,
              {
                $set: {
                  creatorReady: true,
                  visitorReady: true,
                  winner: item.item.visitor,
                },
              },
              { new: true }
            )
              .then((item) => {
                socket.emit("ready_success", { item, msg: "success" });
                socket.broadcast.emit("ready_success", {
                  item,
                  msg: "success",
                });
              })
              .catch((err) => {
                console.log(err);
                socket.emit("ready_failed", { err, msg: "failed" });
              });
          }
        }
      }
    }
  });
};
module.exports = { createRoom, joinRoom, readyEvent };
