const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { query } = require('../db');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.post('/log', async (req, res) => {
  const { animal_id, block_number, details } = req.body;
  const txId = uuidv4();
  await query('INSERT INTO blockchainlogs (transaction_id, block_number, animal_id, details) VALUES ($1, $2, $3, $4)', [
    txId,
    block_number,
    animal_id,
    details,
  ]);
  res.status(201).json({ transaction_id: txId });
});

router.get('/', async (req, res) => {
  const result = await query('SELECT * FROM blockchainlogs ORDER BY timestamp DESC LIMIT 50');
  res.json(result.rows);
});

module.exports = router;
