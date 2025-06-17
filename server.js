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

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));