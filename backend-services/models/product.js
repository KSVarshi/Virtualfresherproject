const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productID: { type: Number, required: true, unique: true },
    ProductName: String,
    ProductDescription: {
        brand: String,
        size: String,
        color: String,
        shortDescription: String,
    },
    gender: String,
    season: String,
    usage: String,
    productCost: Number,
    Ratings: {
        avgRating: Number,
        totalRatings: Number,
    },
    image: String,
});

module.exports = mongoose.model('Product', productSchema);
