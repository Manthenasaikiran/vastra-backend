const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  items: Array,
  total: Number,
  paymentId: String,
  orderId: String,
  user: Object,
  status: String,
  createdAt: Date
});

module.exports = mongoose.model("Order", OrderSchema);