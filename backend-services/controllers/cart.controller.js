const cartService = require("../services/cart.service.js")

async function findCartByUser(req, res){
    //const user = req.user;
    const user = req.User;
    console.log(user._id);
    try {
        const cart = await cartService.findUserCart(user._id);
        return res.status(200).send(cart);
    } catch (error) {
        return res.status(500).send({error:error.message});
    }
    
}

async function addItemToCart(req, res){
    const user = req.User;
    try {
        const cartItem = await cartService.addCartItem(user._id, req.body);
        return res.status(200).send(cartItem);
        console.log("controller");
    } catch (error) {
        return res.status(500).send({error:error.message});
    }
    
}
const cartController = {
    findCartByUser: findCartByUser,
    addItemToCart: addItemToCart
}

module.exports = {findCartByUser, addItemToCart};
//export default {findCartByUser, addItemToCart};