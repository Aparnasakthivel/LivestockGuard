const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { query } = require('../db');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.post('/', async (req, res) => {
  const { animal_id, disease, drug_name, dosage, administration_method, start_date, end_date, veterinarian_id } = req.body;
  const treatmentId = uuidv4();
  await query(
    'INSERT INTO treatments (treatment_id, animal_id, disease, drug_name, dosage, administration_method, start_date, end_date, veterinarian_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
    [treatmentId, animal_id, disease, drug_name, dosage, administration_method, start_date, end_date, veterinarian_id]
  );
  res.status(201).json({ treatment_id: treatmentId });
});

router.get('/', async (req, res) => {
  const result = await query('SELECT * FROM treatments');
  res.json(result.rows);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { disease, drug_name, dosage, administration_method, start_date, end_date, veterinarian_id } = req.body;
  await query(
    'UPDATE treatments SET disease = $1, drug_name = $2, dosage = $3, administration_method = $4, start_date = $5, end_date = $6, veterinarian_id = $7 WHERE treatment_id = $8',
    [disease, drug_name, dosage, administration_method, start_date, end_date, veterinarian_id, id]
  );
  res.json({ message: 'Treatment updated' });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await query('DELETE FROM treatments WHERE treatment_id = $1', [id]);
  res.json({ message: 'Treatment deleted' });
});

module.exports = router;
