const mongoose = require("mongoose");

const PaymentModel = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
        amount: { type: Number, required: true },
        currency: { type: String, default: "usd" },
        transactionId: { type: String, required: true },
        status: { type: String, enum: ["pending", "successful", "failed"], default: "pending" },
    },
    { timestamps: true });

module.exports = mongoose.model("payment", PaymentModel);