const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Configure multer storage and file size limit
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Directory to store uploaded files
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
  }),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB file size limit
});

// Route for file upload
router.post('/upload', upload.single('photo'), (req, res) => {
  res.send('File uploaded successfully');
});

module.exports = router;
