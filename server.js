const express = require('express');
const cors = require('cors');
const multer = require('multer');
const authRoutes = require('./routers/authRoutes'); // ya usas authRoutes
require('dotenv').config();


const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/auth', authRoutes);

app.listen(port, () => console.log(`Servidor corriendo en http://localhost:${port}`));
