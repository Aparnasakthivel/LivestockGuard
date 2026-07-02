const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { query } = require('../db');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.post('/', async (req, res) => {
  const { farm_name, location, registration_number } = req.body;
  const farmId = uuidv4();
  await query('INSERT INTO farms (farm_id, owner_id, farm_name, location, registration_number) VALUES ($1, $2, $3, $4, $5)', [
    farmId,
    req.user.id,
    farm_name,
    location,
    registration_number,
  ]);
  res.status(201).json({ farm_id: farmId });
});

router.get('/', async (req, res) => {
  const result = await query('SELECT * FROM farms');
  res.json(result.rows);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { rows } = await query('SELECT * FROM farms WHERE farm_id = $1', [id]);
  res.json(rows[0]);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { farm_name, location, registration_number } = req.body;
  await query('UPDATE farms SET farm_name = $1, location = $2, registration_number = $3 WHERE farm_id = $4', [
    farm_name,
    location,
    registration_number,
    id,
  ]);
  res.json({ message: 'Farm updated' });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await query('DELETE FROM farms WHERE farm_id = $1', [id]);
  res.json({ message: 'Farm deleted' });
});

module.exports = router;
