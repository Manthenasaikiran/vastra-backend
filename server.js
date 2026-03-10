require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const User = require("./models/User");
const Order = require("./models/Order");
const Product = require("./models/Product");

const app = express();

/* ================= MIDDLEWARE ================= */

app.use(cors({
  origin: "*"
}));

app.use(express.json());

/* ================= DATABASE ================= */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.log("❌ MongoDB Error:", err);
    process.exit(1);
  });

/* ================= RAZORPAY ================= */

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/* ================= ROOT ================= */

app.get("/", (req, res) => {
  res.json({
    message: "🚀 Vastra Backend API Running",
    status: "OK"
  });
});

/* ================= HEALTH ================= */

app.get("/api/health", (req, res) => {
  res.json({
    status: "Server running",
    time: new Date()
  });
});

/* ================= PRODUCTS ================= */

/* GET PRODUCTS */

app.get("/api/products", async (req, res) => {

  try {

    const products = await Product.find();

    res.json(products);

  } catch (error) {

    console.log("Products error:", error);

    res.status(500).json({
      message: "Error fetching products"
    });

  }

});

/* ADD PRODUCT */

app.post("/api/products", async (req, res) => {

  try {

    const product = await Product.create(req.body);

    res.json(product);

  } catch (error) {

    res.status(500).json({
      message: "Product creation failed"
    });

  }

});

/* ================= CREATE ORDER ================= */

app.post("/api/create-order", async (req, res) => {

  try {

    const { amount } = req.body;

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now()
    });

    res.json(order);

  } catch (error) {

    console.log("Create order error:", error);

    res.status(500).json({
      message: "Order creation failed"
    });

  }

});

/* ================= VERIFY PAYMENT ================= */

app.post("/api/verify-payment", async (req, res) => {

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
        user,
        status: "Paid",
        createdAt: new Date()
      });

      res.json({
        success: true,
        order
      });

    } else {

      res.status(400).json({
        success: false,
        message: "Invalid payment signature"
      });

    }

  } catch (error) {

    console.log("Verification error:", error);

    res.status(500).json({
      message: "Payment verification failed"
    });

  }

});

/* ================= SIGNUP ================= */

app.post("/api/signup", async (req, res) => {

  try {

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {

      return res.status(400).json({
        message: "Email already exists"
      });

    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Signup successful",
      token,
      user
    });

  } catch (error) {

    res.status(500).json({
      message: "Signup failed"
    });

  }

});

/* ================= LOGIN ================= */

app.post("/api/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {

      return res.status(400).json({
        message: "User not found"
      });

    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {

      return res.status(400).json({
        message: "Invalid password"
      });

    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user
    });

  } catch (error) {

    res.status(500).json({
      message: "Login failed"
    });

  }

});

/* ================= GET ORDERS ================= */

app.get("/api/orders", async (req, res) => {

  try {

    const orders = await Order.find().sort({ createdAt: -1 });

    res.json(orders);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching orders"
    });

  }

});

/* ================= SERVER ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

  console.log("=================================");
  console.log("🚀 Vastra Backend Running");
  console.log("🌐 Port:", PORT);
  console.log("=================================");

});