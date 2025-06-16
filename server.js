const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const cors = require('cors');
const app = express();
const routes = require('./routes');

app.use(cors({
    origin: 'https://zaloba.vercel.app',
    credentials: true
  }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));