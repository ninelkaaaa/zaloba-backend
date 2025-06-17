const express = require('express');
const multer = require('multer');
const path = require('path');
const pool = require('../db');
const {
  createComplaint,
  getComplaints,
  updateComplaintStatus,
} = require('../controllers/complaintController');

const router = express.Router(); 

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads')); 
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Buffer.from(file.originalname, 'latin1').toString('utf8');
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post('/complaints', upload.single('photo'), createComplaint);
router.get('/complaints', getComplaints);
router.put('/complaints/:id/status', updateComplaintStatus);

router.get('/statuses', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM statuses');
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка при получении статусов', error);
    res.status(500).json({ error: 'Ошибка при получении статусов' });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка при получении категорий:', error);
    res.status(500).json({ error: 'Ошибка сервера при получении категорий' });
  }
});

router.post('/categories', async (req, res) => {
  const { name } = req.body;
  if (!name.trim()) return res.status(400).json({ error: 'Название категории обязательно' });
  try {
    const existing = await pool.query('SELECT * FROM categories WHERE name = $1', [name]);
    if (existing.rows.length) return res.status(400).json({ error: 'Категория уже есть' });
    const result = await pool.query('INSERT INTO categories (name) VALUES ($1) RETURNING *', [name]);
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