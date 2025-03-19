const express = require('express');
const multer = require('multer'); // Ensure multer is imported
const StoreItem = require('../models/StoreItem.js'); // Adjust the path if necessary

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route to handle inventory item addition
router.post('/inventory', upload.single('photo'), async (req, res) => {
  try {
    const { name, code, companyName, description, qty, buyingPrice, price, category } = req.body;

    let photoBase64 = '';
    if (req.file) {
      // Convert the file buffer to a Base64 string
      photoBase64 = req.file.buffer.toString('base64');
    }

    const newItem = new StoreItem({
      name,
      code,
      companyName,
      description,
      qty,
      buyingPrice,
      price,
      category,
      photo: photoBase64, // Store Base64 string in the database
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Error adding item:', error);
    res.status(500).json({ message: 'Failed to add item' });
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

// GET route to fetch a specific inventory item by ID
router.get('/inventory-items/:id', async (req, res) => {
  try {
    const item = await StoreItem.findById(req.params.id).populate('category');
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching item', error });
  }
});

// DELETE route to remove an inventory item by ID
router.delete('/inventory-items/:id', async (req, res) => {
  try {
    const item = await StoreItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting item', error });
  }
});

// PUT route to update an inventory item by ID
// PUT route to update an inventory item by ID
router.put('/inventory-items/:id', upload.single('photo'), async (req, res) => {
    try {
      const { id } = req.params;
      const { name, code, companyName, description, qty, buyingPrice, price, category } = req.body;
  
      let photoBase64 = undefined;
      if (req.file) {
        // Convert the file buffer to a Base64 string if a new photo is uploaded
        photoBase64 = req.file.buffer.toString('base64');
      }
  
      // Build the update object dynamically
      const updateData = {
        name,
        code,
        companyName,
        description,
        qty,
        buyingPrice,
        price,
        category,
      };
  
      // Only include the photo if a new one is uploaded
      if (photoBase64) {
        updateData.photo = photoBase64;
      }
  
      // Find the item by ID and update it
      const updatedItem = await StoreItem.findByIdAndUpdate(id, updateData, {
        new: true, // Return the updated document
        runValidators: true, // Ensure validation rules are applied
      });
  
      if (!updatedItem) {
        return res.status(404).json({ message: 'Item not found' });
      }
  
      res.status(200).json(updatedItem);
    } catch (error) {
      console.error('Error updating item:', error);
      res.status(500).json({ message: 'Error updating item', error });
    }
  });

module.exports = router;
