const express = require("express");
const Driver = require("../models/Driver");
const router = express.Router();

// Add a new driver
router.post("/drivers", async (req, res) => {
    try {
        const newDriver = new Driver(req.body);
        const savedDriver = await newDriver.save();
        res.status(201).json(savedDriver);
    } catch (error) {
        res.status(500).json({ message: "Error adding driver", error });
    }
});

// Get all drivers
router.get("/drivers", async (req, res) => {
    try {
        const drivers = await Driver.find();
        res.status(200).json(drivers);
    } catch (error) {
        res.status(500).json({ message: "Error fetching drivers", error });
    }
});

// Update driver details
router.patch("/drivers/:id", async (req, res) => {
    try {
        const updatedDriver = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedDriver) return res.status(404).json({ message: "Driver not found" });

        res.status(200).json(updatedDriver);
    } catch (error) {
        res.status(500).json({ message: "Error updating driver", error });
    }
});

// Delete driver
router.delete("/drivers/:id", async (req, res) => {
    try {
        const deletedDriver = await Driver.findByIdAndDelete(req.params.id);
        if (!deletedDriver) return res.status(404).json({ message: "Driver not found" });

        res.status(200).json({ message: "Driver deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting driver", error });
    }
});

module.exports = router;
