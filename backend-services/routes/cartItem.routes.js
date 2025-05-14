const express = require('express')
const cartItemController = require("../controllers/cartItem.controller.js") 
const cartItemRouter = express.Router();


cartItemRouter.put("/:id", cartItemController.updateCart);
cartItemRouter.delete("/:id", cartItemController.removeCart);

module.exports = cartItemRouter;
