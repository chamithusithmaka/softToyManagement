const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/Order');
const StoreItem = require('../models/StoreItem');

const router = express.Router();

// DELETE /api/orders/:orderId
router.delete('/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find the order by ID and delete it
    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Return a success message
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to get order details by ID
router.get('/orders/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).send('Order not found');
    }

    // Convert MongoDB document to plain JavaScript object
    const orderData = order.toObject();

    // Optionally convert the ObjectId to a string if needed
    orderData._id = orderData._id.toString();
    orderData.items = orderData.items.map(item => ({
      _id: item._id.toString(),
      name: item.name,
      price: item.price,
      quantity: item.quantity
    }));

    res.json(orderData);
  } catch (error) {
    console.error('Error fetching order details:', error);
    res.status(500).send('Failed to load order details. Please try again.');
  }
});

// Update order status
router.put('/orders/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: `Order status updated to ${status}`, order });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status', error });
  }
});

// Get all orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find({});
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders', error });
  }
});

// Create a new order
router.post('/orders', async (req, res) => {
    try {
      const { customerInfo, items, paymentInfo, userId } = req.body;
  
      // Log the incoming request data
      console.log('Received order data:', { customerInfo, items, paymentInfo, userId });
  
      // Validate required fields
      if (!customerInfo || !items || !paymentInfo || !userId) {
        console.log('Validation failed: Missing required fields');
        return res.status(400).json({ message: 'Missing required fields' });
      }
  
      // Create a new order
      const newOrder = new Order({
        customerInfo,
        items,
        paymentInfo,
        status: 'Pending', // Default status or adjust as needed
        userId,
      });
  
      // Save the order to the database
      await newOrder.save();
      console.log('Order saved successfully:', newOrder);
  
      // Update inventory
      for (const item of items) {
        console.log(`Updating inventory for item ID: ${item._id}, Quantity: ${item.quantity}`);
        const updateResult = await StoreItem.updateOne(
          { _id: item._id },
          { $inc: { qty: -item.quantity } } // Use 'qty' instead of 'quantity'
        );
        console.log(`Inventory update result for item ID ${item._id}:`, updateResult);
      }
  
      res.status(201).json({ message: 'Order placed successfully!', order: newOrder });
    } catch (error) {
      console.error('Error placing order:', error);
      res.status(500).json({ message: 'Error placing order', error });
    }
  });

// Route to fetch orders by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId: userId });
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders by user ID', error: err });
  }
});

// Route to fetch orders with 'Pending' status
router.get('/pending', async (req, res) => {
  try {
    const orders = await Order.find({ status: 'Pending' });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching pending orders', error: err });
  }
});

// Route to fetch orders with 'Completed' status
router.get('/completed', async (req, res) => {
  try {
    const orders = await Order.find({ status: 'Completed' });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching completed orders', error: err });
  }
});

// Route to fetch orders with 'Cancelled' status
router.get('/cancelled', async (req, res) => {
  try {
    const orders = await Order.find({ status: 'Cancelled' });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching cancelled orders', error: err });
  }
});

// Route to fetch orders with 'Completed' status and calculate total income
router.get('/totalIncome', async (req, res) => {
  try {
    const orders = await Order.find({ status: 'Completed' });

    // Calculate total income from completed orders
    const totalIncome = orders.reduce((total, order) => {
      const orderTotal = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      return total + orderTotal;
    }, 0);

    res.status(200).json({ totalIncome }); // Send only total income
  } catch (err) {
    res.status(500).json({ message: 'Error fetching completed orders', error: err });
  }
});

// Route to fetch total count of completed orders
router.get('/totalInvoice', async (req, res) => {
  try {
    // Count the number of completed orders
    const count = await Order.countDocuments({ status: 'Completed' });

    res.status(200).json({ totalCompletedOrders: count }); // Send the count in the response
  } catch (err) {
    res.status(500).json({ message: 'Error fetching completed orders count', error: err });
  }
});

module.exports = router;