const express = require('express');
const cors = require('cors');
const authRoutes = require('./routers/authRoutes');  // Asegúrate de que esta ruta sea correcta
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);  // Aquí está la ruta api/auth

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Servidor corriendo en http://localhost:${port}`));
