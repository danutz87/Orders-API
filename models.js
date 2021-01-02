const mongoose = require("mongoose");

const Order = mongoose.model("Order", {
  id: String,
  product: String,
  price: Number,
});

module.exports = {
  Order,
};
