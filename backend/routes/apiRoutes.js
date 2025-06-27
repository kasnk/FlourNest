const express = require('express');
const router = express.Router();
const { submitRequest, completeRequest, getRequests } = require('../controllers/requestController');

// Get requests (admin view)
router.get('/requests', getRequests);

// Customer submits info
router.post('/submit', submitRequest);

// Admin marks request as completed
router.post('/complete/:id', completeRequest);

module.exports = router;