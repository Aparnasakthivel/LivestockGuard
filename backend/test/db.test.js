const test = require('node:test');
const assert = require('node:assert/strict');
const { initDatabase, query } = require('../src/db');

test('database initialization exposes seeded data', async () => {
  await initDatabase();
  const result = await query('SELECT * FROM animals');
  assert.ok(Array.isArray(result.rows));
  assert.ok(result.rows.length >= 1);
});
