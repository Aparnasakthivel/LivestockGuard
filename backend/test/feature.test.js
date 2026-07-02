const test = require('node:test');
const assert = require('node:assert/strict');
const { initDatabase, query } = require('../src/db');

test('database initialization seeds vaccination and disease report records', async () => {
  await initDatabase();

  const vaccinations = await query('SELECT * FROM vaccinations');
  const diseaseReports = await query('SELECT * FROM diseasereports');

  assert.ok(Array.isArray(vaccinations.rows));
  assert.ok(Array.isArray(diseaseReports.rows));
  assert.ok(vaccinations.rows.length >= 1);
  assert.ok(diseaseReports.rows.length >= 1);
});
