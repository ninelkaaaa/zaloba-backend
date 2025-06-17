const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const routes = require('./routes');

const allowedOrigins = [
  'https://zaloba.vercel.app',
  'https://zaloba-admin.vercel.app',
  'http://localhost:3000',
  'http://localhost:3002'
];

// Настройка CORS
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked by origin: ${origin}`));
    }
  },
  credentials: true,
}));

// Middleware для JSON
app.use(express.json());

// 📂 Статическая раздача фото из папки uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Основные маршруты
app.use(routes);

// Запуск сервера
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));