const mongoose = require('mongoose')

var orderSchema = new mongoose.Schema({
    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
            count: Number,
        },
    ],
    paymentIntent: {},
    orderStatus: {
        type: String,
        default: "Not Processed",
        enum: [
            "Not Processed",
            "Booked"
        ],
    },
    orderby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
},
{
    timestamps: true,
}
)

module.exports=mongoose.model("Order", orderSchema)