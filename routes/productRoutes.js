const express = require("express");
const router = express.Router();

const Product = require("../models/Product");


/* GET ALL PRODUCTS */

router.get("/products", async (req, res) => {

  try {

    const products = await Product.find();

    res.json(products);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching products"
    });

  }

});


/* ADD PRODUCT */

router.post("/products", async (req, res) => {

  try {

    const product = await Product.create(req.body);

    res.json(product);

  } catch (error) {

    res.status(500).json({
      message: "Product creation failed"
    });

  }

});


module.exports = router;