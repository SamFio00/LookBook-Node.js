const mongoose = require("mongoose");

const swapSchema = new mongoose.Schema(
    {
        requesterUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        receiverUser: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        requesterProduct: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        receiverProduct: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

const Swap = mongoose.model("Swap", swapSchema);

module.exports = Swap;