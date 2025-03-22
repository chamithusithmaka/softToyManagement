const express = require("express");
const Delivery = require("../models/Delivery");
const Order = require("../models/Order"); // Fetch order details
const Driver = require("../models/Driver"); // Fetch drivers
const router = express.Router();


// Route to update delivery status to "Cancelled" by orderId
router.patch("/delivery/cancel/:orderId", async (req, res) => {
    const { orderId } = req.params;

    try {
        // Find the delivery record by orderId
        const delivery = await Delivery.findOne({ orderId });

        if (!delivery) {
            return res.status(404).json({ message: "Delivery record not found" });
        }

        // Check if the current status allows cancellation
        if (delivery.status !== "Pending" && delivery.status !== "Out for Delivery") {
            return res.status(400).json({ message: "Order cannot be cancelled at this stage" });
        }

        // Update the status to "Cancelled"
        delivery.status = "Cancelled";
        await delivery.save();

        res.status(200).json({ message: "Delivery status updated to 'Cancelled'", delivery });
    } catch (error) {
        console.error("Error updating delivery status:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


// Route to fetch delivery status by orderId
router.get("/delivery/status/:orderId", async (req, res) => {
    const { orderId } = req.params;

    try {
        // Find the delivery record by orderId
        const delivery = await Delivery.findOne({ orderId });

        if (!delivery) {
            return res.status(404).json({ message: "Delivery record not found" });
        }

        // Return the delivery status
        res.status(200).json({ orderId: delivery.orderId, status: delivery.status });
    } catch (error) {
        console.error("Error fetching delivery status:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

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

module.exports = router;
