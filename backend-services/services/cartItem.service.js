
const CartItem = ("../models/cartItem.model.js")
const findUserById = require("../services/user.service.js")

// import user service pending
async function updateCartItem(userId, cartItemId, cartItemData){
    try {
        const item = await findCartItemById(cartItemId);

        if (!item){
            throw new Error("Cart item not found: ", cartItemId);
        }

        const user = await findUserById(item.userId);

        if(!user){
            throw new Error("User not found: ", userId);
        }

        if(user._id.toString() === userId.toString()){
            item.quantity = cartItemData.quantity;
            item.price = item.quantity * item.product.price;
            const updatedCartItem = await item.save();
            return updatedCartItem;
        }
        else {
            throw new Error("Cart item not updated");
        }
    } catch (error) {
        throw new Error(error.message); 
    }
}

async function removeCartItem(userId, cartItemId){
    try {
        const item = await findCartItemById(cartItemId);

        const user = await userSerivce.findUserById(userId);

        if(user._id.toString() === item.userId.toString()){
           return await item.findByIdAndDelete(cartItemId);
        }
        else {
            throw new Error("Cart item can't be deleted");
        }
    } catch (error) {
        throw new Error(error.message); 
    }
}

async function findCartItemById(cartItemId){
    try {
        const item = await CartItem.findById(cartItemId);

        if (item) {
            return item;
        }
        else {
            throw new Error("CartItem not found: ", cartItemId);
        }
    } catch (error) {
        throw new Error(error.message); 
    }
}

module.exports = {updateCartItem, findCartItemById, removeCartItem};