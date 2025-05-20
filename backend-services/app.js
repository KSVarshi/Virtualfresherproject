const express = require("express");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");
const cartRouter = require("./routes/cart.Routes.js")
const cartItemRouter = require("./routes/cartItem.routes.js");
const { authenticate } = require("./middlewares/authMiddleware.js");
const productRouter = require("./routes/search.js")
require("dotenv").config();

const app = express();

app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.ALLOWED_ORIGIN  // Use specific origin in production
      : '*',                        // Allow all origins in development
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

app.use(express.json());
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/cart_items", cartItemRouter);
app.use("/api/v1", productRouter);

module.exports = app;
