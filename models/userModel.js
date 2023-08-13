const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
    },
    pincode: {
        type: String,
        required: true,
    },
    csdno: {
        type: String,
        required: true,
    },
    dob: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        default: "user",
    },
    cart: {
        type: Array,
        default: [],
    },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    refreshToken: {
        type: String,
    }
}, {
    timestamps: true,
});

//Export the model
module.exports = mongoose.model('User', userSchema);