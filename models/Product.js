const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

  name: String,

  brand: String,

  price: Number,

  image: String,

  category: String,

  description: String,

  createdAt: {
    type: Date,
    default: Date.now
  }

});

module.exports = mongoose.model("Product", productSchema);