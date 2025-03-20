const Driver = require('../models/Driver');
const express = require('express');
const router = express.Router();

// Create driver
router.post('/drivers', async (req, res) => {
  try {
    const driver = new Driver(req.body);
    await driver.save();
    res.status(201).json({ message: 'Driver added successfully', driver });
  } catch (error) {
    res.status(500).json({ message: 'Error adding driver', error });
  }
});

// Get all drivers
router.get('/drivers', async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.status(200).json(drivers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching drivers', error });
  }
});

module.exports = router;
