const express = require('express');
const axios = require('axios');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.post('/predict-risk', async (req, res) => {
  const url = process.env.AI_SERVICE_URL || 'http://localhost:8001';
  const response = await axios.post(`${url}/predict-risk`, req.body);
  res.json(response.data);
});

module.exports = router;
