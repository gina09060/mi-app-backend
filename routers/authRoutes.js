const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const multer = require('multer');
const upload = multer(); // Usa memoria

// ✅ Registro con foto
router.post('/register', upload.single('photo'), authController.register);

// ✅ Actualizar perfil con foto
router.put('/profile/:id', upload.single('photo'), authController.updateProfile);
router.get('/', authController.getAllUsers);
// ✅ Login y otros
router.post('/login', authController.login);
router.get('/profile/:id', authController.getProfile);
router.delete('/profile/:id', authController.deleteProfile);
router.get('/hermandad', authController.hermandad);



module.exports = router;
