const mongoose = require("mongoose");

const customOrderSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    customerInfo: {
        name: { type: String, required: true },
        address: { type: String, required: true },
        phone: { 
            type: String, 
            required: true, 
            match: [/^\d{10}$/, "Phone number must be 10 digits"]
        },
        email: { 
            type: String, 
            required: true, 
            match: [/^\S+@\S+\.\S+$/, "Invalid email address"]
        }
    },
    orderId: { type: String, required: true, unique: true },
    toyType: { type: String, required: true },
    size: { type: String, required: true },
    fabric: { type: String, required: true },
    color: { type: String, required: true },
    message: { type: String },
    accessories: { type: [String] },
    deliveryDate: { type: Date, required: true },
    quantity: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    shippingMethod: { type: String, required: true },
    creditCardInfo: {
        cardNumber: { type: String },
        expiry: { type: String },
        cvv: { type: String }
    },
    status: {
        type: String,
        enum: ["Pending", "On Delivery", "Completed", "Cancelled"],
        default: "Pending"
    }
}, { timestamps: true });

module.exports = mongoose.model("CustomOrder", customOrderSchema);