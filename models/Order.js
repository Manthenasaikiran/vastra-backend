const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  razorpay_order_id: String,
  razorpay_payment_id: String,
  amount: Number,
  status: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);