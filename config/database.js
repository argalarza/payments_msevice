// config/database.js

require('dotenv').config();
const sql = require('mssql');

const host = process.env.SQL_SERVER_HOST;
const port = parseInt(process.env.SQL_SERVER_PORT, 10) || 1433;

// Validación básica
if (!host) {
  throw new Error('❌ SQL_SERVER_HOST no está definido en .env');
}
if (!process.env.SQL_SERVER_USER || !process.env.SQL_SERVER_PASSWORD || !process.env.SQL_SERVER_DATABASE) {
  throw new Error('❌ Faltan variables requeridas en .env (SQL_SERVER_USER, PASSWORD o DATABASE)');
}

// Configuración del pool
const config = {
  user: process.env.SQL_SERVER_USER,
  password: process.env.SQL_SERVER_PASSWORD,
  server: host,
  port: port,
  database: process.env.SQL_SERVER_DATABASE,
  options: {
    encrypt: true,
    trustServerCertificate: true,
    cryptoCredentialsDetails: {
      servername: process.env.SQL_SERVER_SNI_HOST || host,
    },
  },
};

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect(); // conexión asíncrona

module.exports = {
  sql,          // exporta para usar sql.VarChar, sql.Int, etc.
  pool,         // ✅ necesario para usar pool.request()
  poolConnect,  // necesario para esperar que pool esté listo
};
