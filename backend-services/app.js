const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const cartRouter = require("./routes/cart.Routes.js")
const cartItemRouter = require("./routes/cartItem.routes.js");
const { authenticate } = require("./middlewares/authMiddleware.js");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/cart", cartRouter);
app.use("api/v1/cart_items", cartItemRouter);

module.exports = app;
