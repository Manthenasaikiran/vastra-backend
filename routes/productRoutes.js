const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

/* GET PRODUCTS */

router.get("/", async (req, res) => {

  try {

    const products = await Product.find();

    res.json(products);

  } catch (error) {

    res.status(500).json({ message: "Failed to fetch products" });

  }

});

/* ADD PRODUCT */

router.post("/", async (req, res) => {

  try {

    const product = await Product.create(req.body);

    res.json(product);

  } catch (error) {

    res.status(500).json({ message: "Product creation failed" });

  }

});

module.exports = router;