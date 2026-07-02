const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { query } = require('../db');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.post('/', async (req, res) => {
  const { animal_id, vaccine, scheduled_date, status = 'Pending' } = req.body;
  const vaccinationId = uuidv4();
  await query(
    'INSERT INTO vaccinations (vaccination_id, animal_id, vaccine, scheduled_date, status) VALUES ($1, $2, $3, $4, $5)',
    [vaccinationId, animal_id, vaccine, scheduled_date, status]
  );
  res.status(201).json({ vaccination_id: vaccinationId });
});

router.get('/', async (req, res) => {
  const result = await query('SELECT * FROM vaccinations ORDER BY scheduled_date DESC LIMIT 100');
  res.json(result.rows);
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { animal_id, vaccine, scheduled_date, status } = req.body;
  await query(
    'UPDATE vaccinations SET animal_id = $1, vaccine = $2, scheduled_date = $3, status = $4 WHERE vaccination_id = $5',
    [animal_id, vaccine, scheduled_date, status, id]
  );
  res.json({ message: 'Vaccination updated' });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await query('DELETE FROM vaccinations WHERE vaccination_id = $1', [id]);
  res.json({ message: 'Vaccination deleted' });
});

module.exports = router;
