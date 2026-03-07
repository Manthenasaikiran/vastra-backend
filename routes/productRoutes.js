import express from "express";
import Product from "../models/Product.js";

const router = express.Router();

router.get("/", async(req,res)=>{

  const products = await Product.find();
  res.json(products);

});

router.post("/", async(req,res)=>{

  const product = new Product(req.body);
  await product.save();

  res.json(product);

});

export default router;