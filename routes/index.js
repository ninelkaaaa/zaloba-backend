const express = require('express');
const router = express.Router();
const complaintRoutes = require('./complaintRoutes');

router.use('/api', complaintRoutes);

module.exports = router;