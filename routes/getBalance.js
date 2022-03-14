const axios = require("axios");
const getBalance = async (socket) => {
  await axios
    .get("https://api.binance.com/api/v3/ticker/24hr?symbol=ETHUSDT")
    .then((res) => {
      socket.emit("price", { price: res.data.weightedAvgPrice });
    });
};

module.exports = getBalance;
