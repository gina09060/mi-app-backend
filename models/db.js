const mysql = require('mysql');

// Conexión a la base de datos de Aiven con puerto 20651
const connection = mysql.createConnection({
  host: process.env.DB_HOST,       // Host proporcionado por Aiven (ej. aiven.io)
  user: process.env.DB_USER,       // Usuario de la base de datos
  password: process.env.DB_PASSWORD, // Contraseña de la base de datos
  database: process.env.DB_NAME,     // Nombre de la base de datos
  port: 20651                         // Puerto proporcionado por Aiven
});

connection.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err.stack);
    return;
  }
  console.log('Conectado a la base de datos');
});
