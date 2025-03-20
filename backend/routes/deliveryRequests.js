const express = require('express');
const DeliveryRequest = require('../models/DeliveryRequest');
const Driver = require('../models/Driver');
const router = express.Router();

// Create a delivery request
router.post('/delivery-requests', async (req, res) => {
  try {
    const { orderId, userId, address, phone, deliveryDate, notes } = req.body;
    const newRequest = new DeliveryRequest({ orderId, userId, address, phone, deliveryDate, notes });
    await newRequest.save();
    res.status(201).json({ message: 'Delivery request created successfully', request: newRequest });
  } catch (error) {
    res.status(500).json({ message: 'Error creating delivery request', error });
  }
});

// Assign a driver
router.put('/delivery-requests/:id/assign', async (req, res) => {
  try {
    const { id } = req.params;
    const { driverId } = req.body;
    const request = await DeliveryRequest.findByIdAndUpdate(id, { driverId, status: 'Assigned' }, { new: true });
    res.status(200).json({ message: 'Driver assigned successfully', request });
  } catch (error) {
    res.status(500).json({ message: 'Error assigning driver', error });
  }
});

// Update delivery status
router.put('/delivery-requests/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const request = await DeliveryRequest.findByIdAndUpdate(id, { status }, { new: true });
    res.status(200).json({ message: 'Status updated successfully', request });
  } catch (error) {
    res.status(500).json({ message: 'Error updating status', error });
  }
});

module.exports = router;