const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { query } = require('../db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

router.get('/', (req, res) => {
  res.json({ message: 'Auth service ready' });
});

router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const id = uuidv4();
  await query('INSERT INTO users (id, name, email, password, role, verified) VALUES ($1, $2, $3, $4, $5, true)', [
    id,
    name,
    email,
    hashedPassword,
    role,
  ]);
  const token = jwt.sign({ id, role }, JWT_SECRET, { expiresIn: '7d' });
  res.status(201).json({ token, user: { id, name, email, role } });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const { rows } = await query('SELECT * FROM users WHERE email = $1', [email]);
  const user = rows[0];
  if (!user) return res.status(404).json({ message: 'User not found' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

module.exports = router;
