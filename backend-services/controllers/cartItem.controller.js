const cartItemService = require("../services/cartItem.service.js")

const updateCart = async(req, res) => {
    const user = req.user;
    try {
        const updatedCartItem = await cartItemService.updateCartItem(user._id);
        return res.status(200).send(cart);
    } catch (error) {
        return res.status(500).send({error:error.message});
    }
    
}

const removeCart = async(req, res) => {
    const user = req.user;
    try {
        await cartItemService.removeCartItem(user._id, req.params.id);
        return res.status(200).send({message: "cart item removed"});
    } catch (error) {
        return res.status(500).send({error:error.message});
    }
    
}

const cartItemController = {
    updateCart: updateCart,
    removeCart: removeCart
};


module.exports = {updateCart, removeCart};