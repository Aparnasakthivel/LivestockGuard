const express = require('express');
const router = express.Router();

// Simple prescriptions route stubs for JS-only conversion
router.get('/', async (req, res) => {
  res.json({ message: 'List prescriptions (stub)' });
});

router.post('/', async (req, res) => {
  // Expect payload: { treatmentId, prescriptionFile }
  res.status(201).json({ message: 'Prescription created (stub)' });
});

module.exports = router;
