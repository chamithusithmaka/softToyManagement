const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    userId: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    phone: { type: String, required: true, match: [/^\d{10}$/, "Invalid phone number"] },
    specialNotes: { type: String },
    status: {
        type: String,
        enum: ["Pending", "Assigned", "Out for Delivery", "Delivered", "Cancelled"],
        default: "Pending"
    },
    assignedDriver: { type: mongoose.Schema.Types.ObjectId, ref: "Driver", default: null },
}, { timestamps: true });

module.exports = mongoose.model("Delivery", deliverySchema);
