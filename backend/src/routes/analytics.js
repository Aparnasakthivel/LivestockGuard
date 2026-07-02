const express = require('express');
const { query } = require('../db');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.get('/overview', async (req, res) => {
  const farms = await query('SELECT COUNT(*) FROM farms');
  const animals = await query('SELECT COUNT(*) FROM animals');
  const treatments = await query('SELECT COUNT(*) FROM treatments');
  const violations = await query('SELECT COUNT(*) FROM compliancereports WHERE compliance_score < 70');

  res.json({
    totalFarms: Number(farms.rows[0].count),
    totalLivestock: Number(animals.rows[0].count),
    activeTreatments: Number(treatments.rows[0].count),
    mrlViolations: Number(violations.rows[0].count),
  });
});

module.exports = router;
