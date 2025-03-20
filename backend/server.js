const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();

// MongoDB connection
mongoose.connect('mongodb+srv://sithmaka:sithmaka1122@cluster.pvqvoqf.mongodb.net/petcare_DB?retryWrites=true&w=majority&appName=Cluster', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const orderRoutes = require('./routes/Orders.js');
const deliveryRequestRoutes = require('./routes/deliveryRequests.js');
const driverRoutes = require('./routes/drivers.js');

app.use('/api', orderRoutes);
app.use('/api', deliveryRequestRoutes);
app.use('/api', driverRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: 'Something went wrong!' });
});

// Start the server
const PORT = process.env.PORT || 5555;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
