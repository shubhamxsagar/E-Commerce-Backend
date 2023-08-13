const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
    storeId: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    sold: {
        type: Number,
        default: 0,
    },
    images: [],
    ratings: [{
        star: Number,
        star: Number,
        postedby: { type: mongoose.Schema.Types.ObjectId }
    }]
}, { timestamps: true }
);

//Export the model
module.exports = mongoose.model('Product', productSchema);