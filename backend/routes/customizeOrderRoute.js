const express = require("express");
const Order = require("../models/costomizeOrder"); // Adjust path as needed
const router = express.Router();



// Route to delete an order by orderId
router.delete("/custom-orders/delete-by-orderId/:orderId", async (req, res) => {
    try {
        const { orderId } = req.params;

        // Find and delete the order by orderId
        const deletedOrder = await Order.findOneAndDelete({ orderId });

        if (!deletedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ message: "Order deleted successfully", deletedOrder });
    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({ message: "Error deleting order", error: error.message });
    }
});
// Route to create a new custom order
router.post("/customorders", async (req, res) => {
    try {
        console.log("Request received to create a new order:", req.body);

        const {
            orderId, toyType, size, fabric, color, message, accessories,
            deliveryDate, quantity, totalPrice, paymentMethod, shippingMethod, userId, customerInfo, creditCardInfo
        } = req.body;

        // Validate required fields
        if (!orderId || !toyType || !size || !fabric || !color || !deliveryDate || !quantity || !totalPrice || !paymentMethod || !shippingMethod || !userId || !customerInfo) {
            console.log("Validation failed: Missing required fields");
            return res.status(400).json({ message: "Validation failed: Missing required fields" });
        }

        console.log("Creating a new order with the following details:");
        console.log({
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

        console.log("Saving the new order to the database...");
        const savedOrder = await newOrder.save();
        console.log("Order saved successfully:", savedOrder);

        res.status(201).json(savedOrder);
    } catch (error) {
        console.error("Error creating the order:", error.message);
        res.status(500).json({ message: "Error creating the order", error: error.message });
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
// Route to delete an order by orderId
router.delete("/custom-orders/delete-by-orderId/:orderId", async (req, res) => {
    try {
        const { orderId } = req.params;

        // Find and delete the order by orderId
        const deletedOrder = await Order.findOneAndDelete({ orderId });

        if (!deletedOrder) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({ message: "Order deleted successfully", deletedOrder });
    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({ message: "Error deleting order", error: error.message });
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

// Fetch Completed Orders
router.get("/customorders/completed", async (req, res) => {
    try {
        const completedOrders = await Order.find({ status: "Completed" });
        res.status(200).json(completedOrders);
    } catch (error) {
        console.error("Error fetching completed orders:", error);
        res.status(500).json({ message: "Error fetching completed orders", error });
    }
});
// Fetch On Delivery Orders
router.get("/customorders/on-delivery", async (req, res) => {
    try {
        const onDeliveryOrders = await Order.find({ status: "On Delivery" });
        res.status(200).json(onDeliveryOrders);
    } catch (error) {
        console.error("Error fetching on delivery orders:", error);
        res.status(500).json({ message: "Error fetching on delivery orders", error });
    }
});

// Fetch Cancelled Orders
router.get("/customorders/cancelled", async (req, res) => {
    try {
        const cancelledOrders = await Order.find({ status: "Cancelled" });
        res.status(200).json(cancelledOrders);
    } catch (error) {
        console.error("Error fetching cancelled orders:", error);
        res.status(500).json({ message: "Error fetching cancelled orders", error });
    }
});

// Fetch Pending Orders
router.get("/customorders/pending", async (req, res) => {
    try {
        const pendingOrders = await Order.find({ status: "Pending" });
        res.status(200).json(pendingOrders);
    } catch (error) {
        console.error("Error fetching pending orders:", error);
        res.status(500).json({ message: "Error fetching pending orders", error });
    }
});

//http://localhost:5555/api/custom-orders/:order Id
// Route to fetch an order by orderId
router.get("/custom-orders/:orderId", async (req, res) => {
    try {
        const order = await Order.findOne({ orderId: req.params.orderId });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;