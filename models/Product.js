const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  brand: String,
  color: String,
  size: [String],
  description: String,
  category: String,
  stock: Number
});

module.exports = mongoose.model("Product", ProductSchema);