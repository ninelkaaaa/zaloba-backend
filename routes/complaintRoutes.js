const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const pool = require('../db');
const {
  createComplaint,
  getComplaints,
  updateComplaintStatus,
} = require('../controllers/complaintController');

// Жалобы
router.post('/complaints', upload.single('photo'), createComplaint);
router.get('/complaints', getComplaints);
router.put('/complaints/:id/status', updateComplaintStatus);

// Статусы
router.get('/statuses', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM statuses');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Ошибка при получении статусов', error);
    res.status(500).json({ error: 'Ошибка при получении статусов' });
  }
});

// 🔥 КАТЕГОРИИ

// Получение всех категорий
router.get('/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Ошибка при получении категорий:', error);
    res.status(500).json({ error: 'Ошибка сервера при получении категорий' });
  }
});

// Добавление новой категории
router.post('/categories', async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Название категории обязательно' });
  }

  try {
    // Проверка, существует ли уже такая категория
    const existing = await pool.query('SELECT * FROM categories WHERE name = $1', [name]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Такая категория уже существует' });
    }

    const result = await pool.query(
      'INSERT INTO categories (name) VALUES ($1) RETURNING *',
      [name]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка при добавлении категории:', error);
    res.status(500).json({ error: 'Ошибка сервера при добавлении категории' });
  }
});

router.delete('/categories/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM categories WHERE id = $1', [id]);
    res.sendStatus(204);
  } catch (error) {
    console.error('Ошибка при удалении категории:', error);
    res.status(500).json({ error: 'Ошибка при удалении категории' });
  }
});

module.exports = router;
