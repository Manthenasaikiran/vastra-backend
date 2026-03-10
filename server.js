require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

/* ================= MIDDLEWARE ================= */

app.use(cors());
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

/* ================= ROOT ROUTE ================= */

app.get("/", (req, res) => {
  res.json({
    message: "🚀 Vastra Backend Running"
  });
});

/* ================= HEALTH CHECK ================= */

app.get("/api/health", (req, res) => {
  res.json({
    status: "Server running",
    time: new Date()
  });
});

/* ================= SERVER ================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("=================================");
  console.log("🚀 Vastra Backend Running");
  console.log("🌐 Port:", PORT);
  console.log("=================================");
});