const express = require('express');
const twilio = require('twilio');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Initialize Twilio client
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  // Validate inputs
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Send SMS via Twilio
    const smsResponse = await client.messages.create({
      body: `New contact form submission:\n\nName: ${name}\nEmail: ${email}\n\nMessage: ${message}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: process.env.YOUR_PHONE_NUMBER,
    });

    // Optionally: Send email confirmation to user
    // (You could use SendGrid or another email service here)

    res.status(200).json({
      success: true,
      message: 'Message sent successfully!',
      messageSid: smsResponse.sid,
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));