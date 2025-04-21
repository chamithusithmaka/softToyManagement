const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
require('dotenv').config();

const router = express.Router();
const upload = multer();

// POST route to send an email
//http://localhost:5555/api/send-email
router.post('/send-email', upload.single('file'), async (req, res) => {
    const { to, subject, text } = req.body;
    const file = req.file;

    if (!to || !subject || !text) {
        return res.status(400).json({ error: 'Please provide all required fields: to, subject, and text.' });
    }

    try {
        // Create a transporter using your email credentials
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Email options
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
            attachments: file ? [{ filename: file.originalname, content: file.buffer }] : [],
        };

        // Send the email
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email.' });
    }
});

module.exports = router;