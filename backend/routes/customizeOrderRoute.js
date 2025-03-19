const express = require("express");
const Order = require("../models/costomizeOrder"); // Adjust path as needed
const router = express.Router();

router.post("/customorders", async (req, res) => {
    try {
        const {
            orderId, toyType, size, fabric, color, message, accessories,
            deliveryDate, quantity, totalPrice, paymentMethod, shippingMethod, userId, customerInfo, creditCardInfo
        } = req.body;

        // Validate required fields
        if (!orderId || !toyType || !size || !fabric || !color || !deliveryDate || !quantity || !totalPrice || !paymentMethod || !shippingMethod || !userId || !customerInfo) {
            return res.status(400).json({ message: "Validation failed: Missing required fields" });
        }

        const newOrder = new Order({
            orderId,
            toyType,
            size,
            fabric,
            color,
            message,
            accessories,
            deliveryDate,
            quantity,
            totalPrice,
            paymentMethod,
            shippingMethod,
            userId,
            customerInfo,
            creditCardInfo: paymentMethod === "credit-card" ? creditCardInfo : null
        });

        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (error) {
        console.error("Error creating the order:", error);
        res.status(500).json({ message: "Error creating the order", error });
    }
});

// Get all orders
router.get("/costomorders", async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching orders", error });
    }
});

// Get order by ID
router.get("/costomorders/:id", async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching order", error });
    }
});

// Update order status
router.patch("/costomorders/:id/status", async (req, res) => {
    try {
        const { status } = req.body;

        // Check if status is valid
        if (!["Pending", "On Delivery", "Completed", "Cancelled"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating order status", error });
    }
});

// Delete order by ID
router.delete("/costomorders/:id", async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        if (!deletedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error deleting order", error });
    }
});

router.patch("/costomorders/:id", async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating order", error });
    }
});

router.patch("/costomorders/:id/status", async (req, res) => {
    try {
        const { status } = req.body;
        if (!["Pending", "On Delivery", "Completed", "Cancelled"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!updatedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating order status", error });
    }
});

module.exports = router;