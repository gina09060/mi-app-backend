const mysql = require('mysql2');

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,  // El puerto 3306 es el por defecto para MySQL
  ssl: {
    rejectUnauthorized: true  // Asegura que la conexión es segura
  }
});

db.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos: ', err);
  } else {
    console.log('Conexión a la base de datos establecida');
  }
});

module.exports = db;
