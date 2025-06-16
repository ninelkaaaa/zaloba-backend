const { Pool } = require('pg');

const pool = new Pool({
  user: 'zaloba_db_user',         // смотри в Render → DATABASE → Internal Database URL
  host: 'dpg-d1818i8gjchc73f92gkg-a.oregon-postgres.render.com',
  database: 'zaloba-db',    // название твоей базы
  password: 'KLdBeUAj1ruuOX0rRdd3nSOmPMYkC9q3',
  port: 5432,
  ssl: {
    rejectUnauthorized: false
  }
});

module.exports = pool;