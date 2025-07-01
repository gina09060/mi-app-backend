require('dotenv').config();  // Asegúrate de que dotenv esté instalado

const mysql = require('mysql');

const connection = mysql.createConnection({
  host: process.env.DB_HOST,         // Usar la variable de entorno DB_HOST
  user: process.env.DB_USER,         // Usar la variable de entorno DB_USER
  password: process.env.DB_PASSWORD, // Usar la variable de entorno DB_PASSWORD
  database: process.env.DB_NAME,     // Usar la variable de entorno DB_NAME
  port: 3306                         // Puerto para MySQL
});

connection.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err.stack);
    return;
  }
  console.log('Conectado a la base de datos');
});

module.exports = connection;
