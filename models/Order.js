const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

  items: [
    {
      productId: String,
      name: String,
      price: Number,
      quantity: Number
    }
  ],

  total: Number,

  paymentId: String,

  orderId: String,

  user: {
    name: String,
    email: String
  },

  status: {
    type: String,
    default: "Paid"
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Order", orderSchema);