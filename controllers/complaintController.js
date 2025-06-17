const pool = require('../db');

const createComplaint = async (req, res) => {
  const { category, message } = req.body;
  const photo = req.file ? uploads/${req.file.filename} : null;

  try {
    const result = await pool.query(
      'INSERT INTO complaints (category, message, photo_url) VALUES ($1, $2, $3) RETURNING *',
      [category, message, photo]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка при создании жалобы:', error);
    res.status(500).json({ error: 'Ошибка сервера при создании жалобы' });
  }
};

const getComplaints = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM complaints ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Ошибка при получении жалоб:', error);
    res.status(500).json({ error: 'Ошибка сервера при получении жалоб' });
  }
};

const updateComplaintStatus = async (req, res) => {
  const { id } = req.params;
  const { status_id } = req.body;
  try {
    const result = await pool.query(
      'UPDATE complaints SET status_id = $1 WHERE id = $2 RETURNING *',
      [status_id, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка при обновлении статуса жалобы:', error);
    res.status(500).json({ error: 'Ошибка при обновлении статуса' });
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  updateComplaintStatus,
};