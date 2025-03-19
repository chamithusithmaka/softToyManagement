const express = require('express');
const fs = require('fs');
const path = require('path');
const StoreItem = require('../models/StoreItem');

const router = express.Router();

// Get all items
router.get('/store-items', async (req, res) => {
  try {
    const items = await StoreItem.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching items', error });
  }
});

// GET route to fetch all inventory items
router.get('/inventory-items', async (req, res) => {
  try {
    const items = await StoreItem.find().populate('category'); // Populate category if needed
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inventory items', error });
  }
});


// Update item quantity
router.put('/store-items/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { qty } = req.body;
    await StoreItem.findByIdAndUpdate(id, { qty });
    res.status(200).json({ message: 'Item quantity updated successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating item quantity', error });
  }
});

// Update item quantity
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { qty } = req.body;
    const item = await StoreItem.findById(id);
    if (item) {
      item.qty = qty;
      await item.save();
      res.status(200).json({ message: 'Item quantity updated successfully!' });
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating item quantity', error });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const item = await StoreItem.findById(id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Error fetching item:', error);
    res.status(500).json({ message: 'Error fetching item', error });
  }
});

// Update items
router.put('/item/:id', async (req, res) => {
  try {
    const updatedItem = await StoreItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Error updating item', error });
  }
});

// Delete items from the database
router.delete('/item/:id', async (req, res) => {
  try {
    const deletedItem = await StoreItem.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting item', error });
  }
});

// Route to get all Inventory items
router.get('/', async (req, res) => {
  try {
    const items = await StoreItem.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching items', error });
  }
});

// Fetch a specific item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await StoreItem.findById(req.params.id);
    res.json(item);
  } catch (error) {
    res.status(404).json({ message: 'Item not found', error });
  }
});

module.exports = router;