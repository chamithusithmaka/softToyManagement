const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true, match: [/^\d{10}$/, "Invalid phone number"] },
    nic: { type: String, required: true },
    vehicleType: { type: String, required: true },
    vehicleNo: { type: String, required: true },
    licenseNo: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Driver", driverSchema);
