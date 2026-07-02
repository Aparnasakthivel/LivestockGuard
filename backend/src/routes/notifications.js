const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { query } = require('../db');
const { protect } = require('../middleware/auth');

const router = express.Router();
router.use(protect);

router.post('/', async (req, res) => {
  const { user_id, title, message, status = 'pending' } = req.body;
  const notificationId = uuidv4();
  await query('INSERT INTO notifications (notification_id, user_id, title, message, status) VALUES ($1, $2, $3, $4, $5)', [
    notificationId,
    user_id,
    title,
    message,
    status,
  ]);
  res.status(201).json({ notification_id: notificationId });
});

router.get('/', async (req, res) => {
  const result = await query('SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50');
  res.json(result.rows);
});

router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  await query('UPDATE notifications SET status = $1 WHERE notification_id = $2', [status, id]);
  res.json({ message: 'Notification updated' });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await query('DELETE FROM notifications WHERE notification_id = $1', [id]);
  res.json({ message: 'Notification deleted' });
});

module.exports = router;
