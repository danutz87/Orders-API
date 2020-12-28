const mongoose = require("mongoose");

const Order = mongoose.model("Order", {
  id: Number,
  product: String,
  price: Number,
});

module.exports = {
  Order,
};
