const express = require('express')
const cartController = require("../controllers/cart.controller.js");
const { authenticate } = require('../middlewares/authMiddleware.js');
const cartRouter = express.Router();


cartRouter.get("/", authenticate, cartController.findCartByUser);
cartRouter.put("/add", authenticate, cartController.addItemToCart);

module.exports = cartRouter;
