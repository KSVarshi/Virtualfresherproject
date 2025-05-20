const productServices = require("../services/product.service.js")

const getProduct = async(req, res) => {
    const productId = req.params.id;
    try {
        const product = await productServices.findProductById(productId);
      //  console.log(product)
        return res.status(200).json(product);
    } catch (error) {
        return res.status(500).send({error:error.message});
    }
    
}

const getRecommendation = async(req, res) => {
    const productId = req.params.id;
    try {
        const recommendedProduct = await productServices.getRecommendedProduct(productId);
        console.log(recommendedProduct)
        return res.status(200).json(recommendedProduct);
    } catch (error) {
        return res.status(500).send({error:error.message});
    }
    
}

module.exports = {getProduct, getRecommendation}