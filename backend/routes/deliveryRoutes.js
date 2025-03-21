const express = require("express");
const Delivery = require("../models/Delivery");
const Order = require("../models/Order"); // Fetch order details
const Driver = require("../models/Driver"); // Fetch drivers
const router = express.Router();

// Create a new delivery request
router.post("/delivery", async (req, res) => {
    try {
        const { orderId, userId, deliveryAddress, phone, specialNotes } = req.body;

        // Fetch order details from DB
        const order = await Order.findOne({ orderId });

        const newDelivery = new Delivery({
            orderId,
            userId,
            deliveryAddress,
            phone,
            specialNotes,
            status: "Pending"
        });

        const savedDelivery = await newDelivery.save();
        res.status(201).json(savedDelivery);
    } catch (error) {
        res.status(500).json({ message: "Error creating delivery", error });
    }
});

// Get all delivery requests
router.get("/delivery", async (req, res) => {
    try {
        const deliveries = await Delivery.find().populate("assignedDriver");
        res.status(200).json(deliveries);
    } catch (error) {
        res.status(500).json({ message: "Error fetching deliveries", error });
    }
});

// Assign a driver to a delivery
router.patch("/delivery/:id/assign", async (req, res) => {
    try {
        const { driverId } = req.body;
        const driver = await Driver.findById(driverId);
        if (!driver) return res.status(404).json({ message: "Driver not found" });

        const updatedDelivery = await Delivery.findByIdAndUpdate(
            req.params.id,
            { assignedDriver: driverId, status: "Assigned" },
            { new: true }
        );

        if (!updatedDelivery) return res.status(404).json({ message: "Delivery not found" });

        res.status(200).json(updatedDelivery);
    } catch (error) {
        res.status(500).json({ message: "Error assigning driver", error });
    }
});

// Update delivery status
router.patch("/delivery/:id/status", async (req, res) => {
    try {
        const { status } = req.body;
        if (!["Pending", "Assigned", "Out for Delivery", "Delivered", "Cancelled"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const updatedDelivery = await Delivery.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!updatedDelivery) return res.status(404).json({ message: "Delivery not found" });

        res.status(200).json(updatedDelivery);
    } catch (error) {
        res.status(500).json({ message: "Error updating delivery status", error });
    }
});

// Delete a delivery
router.delete("/delivery/:id", async (req, res) => {
    try {
        const deletedDelivery = await Delivery.findByIdAndDelete(req.params.id);
        if (!deletedDelivery) return res.status(404).json({ message: "Delivery not found" });

        res.status(200).json({ message: "Delivery deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting delivery", error });
    }
});

module.exports = router;
