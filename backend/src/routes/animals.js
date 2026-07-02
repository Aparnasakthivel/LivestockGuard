const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { query } = require('../db');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.post('/', async (req, res) => {
  const { farm_id, species, breed, age, weight, gender, qr_code, rfid_tag, image_url } = req.body;
  const animalId = uuidv4();
  await query(
    'INSERT INTO animals (animal_id, farm_id, species, breed, age, weight, gender, qr_code, rfid_tag, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
    [animalId, farm_id, species, breed, age, weight, gender, qr_code, rfid_tag, image_url]
  );
  res.status(201).json({ animal_id: animalId });
});

router.get('/', async (req, res) => {
  const result = await query('SELECT * FROM animals');
  res.json(result.rows);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { rows } = await query('SELECT * FROM animals WHERE animal_id = $1', [id]);
  res.json(rows[0]);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { species, breed, age, weight, gender, qr_code, rfid_tag, image_url } = req.body;
  await query(
    'UPDATE animals SET species = $1, breed = $2, age = $3, weight = $4, gender = $5, qr_code = $6, rfid_tag = $7, image_url = $8 WHERE animal_id = $9',
    [species, breed, age, weight, gender, qr_code, rfid_tag, image_url, id]
  );
  res.json({ message: 'Animal updated' });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await query('DELETE FROM animals WHERE animal_id = $1', [id]);
  res.json({ message: 'Animal removed' });
});

module.exports = router;
