const express = require('express');
const productRouter = express.Router();
const productController = require("../controllers/product.controller.js") 
const Product = require('../models/product');

// GET /api/search
productRouter.get('/products', async (req, res) => {
    try {
        const {
            name,
            brand,
            color,
            minPrice,
            maxPrice,
            minRating,
            gender,
            page = 1,
            limit = 10,
        } = req.query;

        console.log(req.query)

        const filter = {};

        if (name) filter.ProductName = { $regex: name, $options: 'i' };
        if (brand) filter['ProductDescription.brand'] = { $regex: brand, $options: 'i' };
        if (color) filter['ProductDescription.color'] = { $regex: color, $options: 'i' };
        if (gender) filter.gender = gender;
        if (minPrice || maxPrice) {
            filter.productCost = {};
            if (minPrice) filter.productCost.$gte = parseFloat(minPrice);
            if (maxPrice) filter.productCost.$lte = parseFloat(maxPrice);
        }
        if (minRating) filter['Ratings.avgRating'] = { $gte: parseFloat(minRating) };

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const products = await Product.find(filter)
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Product.countDocuments(filter);

        res.json({
            totalResults: total,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            products,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

productRouter.get('/products/:id', productController.getProduct);

productRouter.get('/products/recommendation/:id', productController.getRecommendation);

module.exports = productRouter;
