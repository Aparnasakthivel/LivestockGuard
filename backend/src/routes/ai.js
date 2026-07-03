const express = require('express');
const axios = require('axios');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.post('/predict-risk', async (req, res) => {
  const url = process.env.AI_SERVICE_URL;
  if (!url) {
    return res.status(500).json({ message: 'AI_SERVICE_URL is not configured.' });
  }

  const response = await axios.post(`${url}/predict-risk`, req.body);
  res.json(response.data);
});

module.exports = router;
