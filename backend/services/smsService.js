const dotenv = require('dotenv');
dotenv.config(); 
const twilio = require('twilio');
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

const sendSMS = async (to, body) => {
  try {
    await client.messages.create({
      body,
      from: process.env.TWILIO_PHONE,
      to,
    });
    console.log(`✅ SMS sent to ${to}`);
  } catch (err) {
    console.error('❌ Failed to send SMS:', err.message);
  }
};

module.exports = sendSMS;