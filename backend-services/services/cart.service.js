const Cart = require("../models/cart.model.js")
const CartItem = require("../models/cartItem.model.js")
const Product = require("../models/product.js");

async function createCart(user){
    try {
        const cart = new Cart({user});
        const createdCart = await cart.save();
        return createdCart;
    }
    catch (error) {
        throw new Error(error.message);
    }
}

async function findUserCart(userId){
    try {
        let cart = await Cart.findOne({user:userId});
        let CartItems = await CartItem.find({cart:cart._id}).populate("product");
        cart.cartItems = CartItems;
        console.log("finding user")
        let totalPrice = 0;
        let totalItem = 0;
        for(let cartItem of cart.cartItems){
            totalPrice += cartItem.price;
            totalItem += cartItem.quantity;
        }
        cart.totalPrice = totalPrice;
        cart.totalItem = totalItem;
        return cart;
    }
    catch (error){

        throw new Error(error.message);

    }
}

async function addCartItem(userId, req){
    try {
        console.log("services")
        const cart = await Cart.findOne({user:userId});
        const product = await Product.findById(req.productId);

        const isPresent = await CartItem.findOne({cart:cart._id, product:product._id, userId});

        if (!isPresent){
            const cartItem = new CartItem({
                product: product._id,
                cart: cart._id,
                quantity: 1,
                userId,
                price: product.productCost
            });

            const createdCartItem = await cartItem.save();
            cart.cartItems.push(createdCartItem);
            await cart.save();
            return "Item added to the cart"   
        }
    }
    catch (error){

        throw new Error(error.message);

    }
}

module.exports = {createCart, findUserCart, addCartItem};