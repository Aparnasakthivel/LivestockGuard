const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { query } = require('../db');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.post('/', async (req, res) => {
  const { animal_id, disease, severity, status = 'Under Review', assigned_vet } = req.body;
  const reportId = uuidv4();
  await query(
    'INSERT INTO diseasereports (report_id, animal_id, disease, severity, status, assigned_vet) VALUES ($1, $2, $3, $4, $5, $6)',
    [reportId, animal_id, disease, severity, status, assigned_vet]
  );
  res.status(201).json({ report_id: reportId });
});

router.get('/', async (req, res) => {
  const result = await query('SELECT * FROM diseasereports ORDER BY created_at DESC LIMIT 100');
  res.json(result.rows);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { disease, severity, status, assigned_vet } = req.body;
  await query(
    'UPDATE diseasereports SET disease = $1, severity = $2, status = $3, assigned_vet = $4 WHERE report_id = $5',
    [disease, severity, status, assigned_vet, id]
  );
  res.json({ message: 'Disease report updated' });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await query('DELETE FROM diseasereports WHERE report_id = $1', [id]);
  res.json({ message: 'Disease report deleted' });
});

module.exports = router;
