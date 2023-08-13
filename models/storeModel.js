const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var storeSchema = new mongoose.Schema({
    storeId: {
        type: String,
        default: "",
    },
    pincode: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: "Not Verified",
    },
    type: {
        type: String,
        default: "store",
    },
}, {
    timestamps: true,
});

//Export the model
module.exports = mongoose.model('Store', storeSchema);