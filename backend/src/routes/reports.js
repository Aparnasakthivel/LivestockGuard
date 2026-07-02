const express = require('express');
const { query } = require('../db');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.get('/', async (req, res) => {
  const result = await query('SELECT * FROM compliancereports ORDER BY generated_at DESC LIMIT 10');
  res.json(result.rows);
});

router.get('/compliance/:farmId', async (req, res) => {
  const { farmId } = req.params;
  const { rows } = await query('SELECT * FROM compliancereports WHERE farm_id = $1 ORDER BY generated_at DESC', [farmId]);
  res.json(rows);
});

router.get('/summary', async (req, res) => {
  const result = await query('SELECT * FROM compliancereports ORDER BY generated_at DESC LIMIT 100');
  res.json(result.rows);
});

module.exports = router;
