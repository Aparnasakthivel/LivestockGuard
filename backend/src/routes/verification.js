const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { query } = require('../db');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.post('/', async (req, res) => {
  const { animal_id, product_name, verified } = req.body;
  const verificationId = uuidv4();
  await query('INSERT INTO qrverification (verification_id, animal_id, product_name, verified, scanned_at) VALUES ($1, $2, $3, $4, NOW())', [
    verificationId,
    animal_id,
    product_name,
    verified,
  ]);
  res.status(201).json({ verification_id: verificationId });
});

router.get('/:animalId', async (req, res) => {
  const { animalId } = req.params;
  const { rows } = await query('SELECT * FROM qrverification WHERE animal_id = $1 ORDER BY scanned_at DESC LIMIT 1', [animalId]);
  res.json(rows[0]);
});

module.exports = router;
