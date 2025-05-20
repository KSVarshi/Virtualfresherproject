const Product = require("../models/product.js")
const axios = require('axios')

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/', // Replace with your actual API URL
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
})

const findProductById = async (productId) => {
    try {
        const product = await Product.findOne({ productID: productId });
        // console.log("Product found", product)
        if (!product) {
            throw new Error("Product not found", productId);
        }
        return product;
    } catch (error) {
        throw new Error(error.message);
    }
}

const getRecommendedProduct = async (productId) => {
    try {
        const product = await findProductById(productId);
        const response = await api.get(`/recommend/${product.ProductName}`)
        const pArray = response.data.results.map(p => p.id);
        const recommendedProduct = await Product.find({ productID: { $in: pArray } });
        //console.log(recommendedProduct)
        return recommendedProduct;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = { findProductById, getRecommendedProduct }