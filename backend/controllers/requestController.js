const Request = require('../models/Request');
const sendSMS = require('../services/smsService');

// Handle new customer entry
exports.submitRequest = async (req, res) => {
  try {
    const { phone, containerType } = req.body;

    const generateUniqueOTP = async () => {
      let isUnique = false;
      let otp;

      while (!isUnique) {
        otp = Math.floor(1000 + Math.random() * 9000).toString();
        const existing = await Request.findOne({ uniqueId: otp, status: 'pending' });
        if (!existing) {
          isUnique = true;
        }
      }

      return otp;
    };

    const uniqueId = await generateUniqueOTP();
    const formattedPhone = phone.startsWith('+91')
  ? phone
  : `+91${phone}`;

    const newRequest = new Request({
      phone: formattedPhone ,
      containerType,
      uniqueId,
      status: 'pending',
    });

    await newRequest.save();

    // 🔔 Send SMS via Twilio
    await sendSMS(formattedPhone, `Your Order ID is ${uniqueId}. We'll notify you when it's ready.`);

    res.status(201).json({ message: 'Request submitted successfully!', uniqueId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong.' });
  }
};

// Get requests for admin dashboard
exports.getRequests = async (req, res) => {
  const status = req.query.status || 'pending';

  try {
    const requests = await Request.find({ status }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch requests.' });
  }
};

// Mark request as completed
exports.completeRequest = async (req, res) => {
  const { id } = req.params;

  try {
    const request = await Request.findOne({ uniqueId: id });
    if (!request) return res.status(404).json({ error: 'Request not found' });

    const phone = request.phone.startsWith('+91') ? request.phone : `+91${request.phone}`;

    // 🔔 Notify customer before deletion
    await sendSMS(phone, `Hi! Your flour is ready for pickup. Order ID: ${id}`);

    // 🗑️ Delete the request permanently
    await Request.deleteOne({ uniqueId: id });

    res.json({ message: 'Request completed and deleted from system.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to complete and delete request.' });
  }
};