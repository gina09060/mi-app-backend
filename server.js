const express = require('express');
const cors = require('cors');
const multer = require('multer');
const authRoutes = require('./routers/authRoutes'); // ya usas authRoutes
require('dotenv').config();

const app = express();
const frontendUrl = "https://admirable-entremet-0475ae.netlify.app";  // URL de tu frontend

app.use(cors({
  origin: frontendUrl,  // Solo permitir solicitudes desde tu frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
// Usar el puerto de la variable de entorno `PORT`, o por defecto el 8000 para desarrollo
const port = process.env.PORT || 8000;  // En producción, usará el puerto asignado por el entorno

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);

app.listen(port, () => console.log(`Servidor corriendo en http://localhost:${port}`));
