const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true,
    trim: true
  },

  price: {
    type: Number,
    required: true
  },

  image: {
    type: String,
    default: ""
  },

  brand: {
    type: String,
    default: ""
  },

  color: {
    type: String,
    default: ""
  },

  size: [
    {
      type: String
    }
  ],

  description: {
    type: String,
    default: ""
  },

  category: {
    type: String,
    default: "Clothing"
  },

  stock: {
    type: Number,
    default: 0
  }

},
{
  timestamps: true
}
);

module.exports = mongoose.model("Product", productSchema);