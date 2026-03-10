const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const Order = require("../models/Order");

const router = express.Router();

/* RAZORPAY */

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

/* CREATE ORDER */

router.post("/create-order", async (req, res) => {

  try {

    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "order_" + Date.now()
    });

    res.json(order);

  } catch (error) {

    res.status(500).json({ message: "Order creation failed" });

  }

});

/* VERIFY PAYMENT */

router.post("/verify-payment", async (req, res) => {

  try {

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      cart,
      total,
      user
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {

      const order = await Order.create({
        items: cart,
        total,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        user
      });

      res.json({ success: true, order });

    } else {

      res.status(400).json({ success: false });

    }

  } catch (error) {

    res.status(500).json({ message: "Payment verification failed" });

  }

});

/* GET ORDERS */

router.get("/", async (req, res) => {

  const orders = await Order.find().sort({ createdAt: -1 });

  res.json(orders);

});

module.exports = router;