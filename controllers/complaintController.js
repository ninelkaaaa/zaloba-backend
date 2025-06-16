const pool = require('../db');

// Создать жалобу
exports.createComplaint = async (req, res) => {
  const { category, message } = req.body;
  const photo = req.file ? req.file.filename : null;

  try {
    const result = await pool.query(
      `INSERT INTO complaints (category, message, photo_url, status_id) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [category, message, photo, 1] // 1 = "В обработке"
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка в createComplaint:', error);
    res.status(500).json({ error: 'Ошибка при сохранении жалобы' });
  }
};

// Получить жалобы
exports.getComplaints = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT c.id, c.category, c.message, c.photo_url, c.created_at,
             s.id AS status_id, s.name AS status_name
      FROM complaints c
      JOIN statuses s ON c.status_id = s.id
      ORDER BY c.created_at DESC
    `);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Ошибка в getComplaints:', error);
    res.status(500).json({ error: 'Ошибка при получении жалоб' });
  }
};

// Обновить статус
exports.updateComplaintStatus = async (req, res) => {
  const { id } = req.params;
  const { status_id } = req.body;

  try {
    const result = await pool.query(
      'UPDATE complaints SET status_id = $1 WHERE id = $2 RETURNING *',
      [status_id, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Ошибка при обновлении статуса:', error);
    res.status(500).json({ error: 'Ошибка при обновлении статуса' });
  }
};

