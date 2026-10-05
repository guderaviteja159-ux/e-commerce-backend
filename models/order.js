const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    items: {
        type: Array,
        required: true
    },

    totalAmount: {
        type: Number,
        required: true
    },

    status: {
        type: String,
        required: true,
        default: "pending"
    },

    shippingAddress: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Order", orderSchema);