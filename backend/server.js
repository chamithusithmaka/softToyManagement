const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const multer = require('multer');

const app = express();

// MongoDB connection
mongoose.connect('mongodb+srv://admin:anysZ1C3MjUWFojv@cluster0.pe8lg.mongodb.net/', { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());

// Increase payload size limit for JSON and URL-encoded data
app.use(bodyParser.json({ limit: '10mb' })); // Increase JSON payload limit to 10MB
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true })); // Increase URL-encoded payload limit

// Serve static files (for uploaded files)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Save files to 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); // Create a unique filename
  },
});
const upload = multer({ storage });

// Routes
const inventory = require('./routes/InventoryItems.js');
const categories = require('./routes/Catagory.js');
const uploadRoutes = require('./routes/uploadRoutes.js');
const storeItemRoutes = require('./routes/storeItemRoutes.js');
const orderRoutes = require('./routes/Orders.js');
const customizeOrder = require("./routes/customizeOrderRoute.js");
const deliveryRoutes = require("./routes/deliveryRoutes.js");
const driverRoutes = require("./routes/driverRoutes.js");  // Adjust path as needed

app.use(inventory);
app.use(categories);
app.use(uploadRoutes);
app.use('/store-items', storeItemRoutes);
app.use('/api', orderRoutes);
app.use("/api", customizeOrder);
app.use("/api", deliveryRoutes);
app.use("/api", driverRoutes);

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