const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router(); // create router instance

// Define the sendEmail function
// router.post('/send-email', async (req, res) => {
exports.sendEmail = async (req, res) => {
    const { name, email, subject, message } = req.body;

    try {
        // Create a transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'annaashok4197@gmail.com',
                pass: 'ilba lusq tbex peyv'  // You may need an App Password for Gmail
            }
        });

        // Compose email options
        const mailOptions = {
            from: 'annaashok4197@gmail.com',
            replyTo: email, // User's email
            to: 'annaashok4197@gmail.com',
            subject: `New message from: ${name} - ${subject}`,
            text: `From: ${name} (${email})\n\n${message}`
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send email.' });
    }
};
