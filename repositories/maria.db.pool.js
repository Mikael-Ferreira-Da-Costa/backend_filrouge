// repositories/maria.db.pool.js
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: process.env.MARIADB_USER,
  password: process.env.MARIADB_PASSWORD,
  database: process.env.MARIADB_DB,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
