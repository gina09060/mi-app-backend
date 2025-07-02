const db = require('../models/db');
const bcrypt = require('bcrypt');

// ✅ REGISTRO
exports.register = async (req, res) => {
  try {
    const {
      name, lastname, birthday, phone,
      age, sex, description, direccion,
      email, password
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const photo = req.file ? req.file.buffer : null;

    const sql = `
      INSERT INTO application (name, lastname, birthday, phone, age, sex, description, direccion, email, password, photo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [name, lastname, birthday, phone, age, sex, description, direccion, email, hashedPassword, photo],
      (err, result) => {
        if (err) return res.status(500).json({ error: 'Error al registrar', details: err });
        res.json({ success: true, userId: result.insertId });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// ✅ LOGIN
exports.login = (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM application WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al buscar usuario' });
    if (results.length === 0) return res.status(401).json({ error: 'Credenciales incorrectas' });

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).json({ error: 'Credenciales incorrectas' });

    res.json({ user });
  });
};

// ✅ OBTENER PERFIL
exports.getProfile = (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM application WHERE id = ?', [id], (err, results) => {
    if (err || results.length === 0) return res.status(404).json({ message: "No encontrado" });
    res.json(results[0]);
  });
};

// ✅ ACTUALIZAR PERFIL (con imagen y todos los campos)
// controllers/authController.js
exports.updateProfile = (req, res) => {
  const id = req.params.id;
  const {
    name, lastname, phone, direccion, description,
    birthday, age, sex, email
  } = req.body;

  const photo = req.file ? req.file.buffer : null;

  const campos = [
    name, lastname, phone, direccion, description,
    birthday, age, sex, email
  ];

  let sql = `
    UPDATE application SET
    name=?, lastname=?, phone=?, direccion=?, description=?,
    birthday=?, age=?, sex=?, email=?
  `;

  if (photo) {
    sql += `, photo=?`;
    campos.push(photo);
  }

  sql += ` WHERE id=?`;
  campos.push(id);

  db.query(sql, campos, (err) => {
    if (err) {
      console.error("❌ Error SQL:", err);
      return res.status(500).json({ error: 'Error al actualizar perfil', details: err });
    }
    res.json({ message: '✅ Perfil actualizado correctamente' });
  });
};


// ✅ ELIMINAR PERFIL
exports.deleteProfile = (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM application WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Cuenta eliminada" });
  });
};

exports.hermandad = (req, res) => {
  const filtro = req.query.filtro || 'semana';
  const hoy = new Date();
  
  if (filtro === 'semana') {
    // Obtener el domingo y sábado de la semana actual
    const domingo = new Date(hoy);
    domingo.setDate(hoy.getDate() - hoy.getDay());
    domingo.setHours(0, 0, 0, 0);
    
    const sabado = new Date(domingo);
    sabado.setDate(domingo.getDate() + 6);
    sabado.setHours(23, 59, 59, 999);

    // Consulta para cumpleaños en este rango
    const sql = `
      SELECT id, name, lastname, birthday, photo,
      TIMESTAMPDIFF(YEAR, birthday, CURDATE()) AS edad
      FROM application
      WHERE 
        (MONTH(birthday) = ? AND DAY(birthday) BETWEEN ? AND ?)
        OR
        (MONTH(birthday) = ? AND DAY(birthday) BETWEEN ? AND ?)
      ORDER BY 
        CASE 
          WHEN MONTH(birthday) = MONTH(CURDATE()) THEN DAY(birthday)
          ELSE DAY(birthday) + 31
        END
    `;
    
    const params = [
      domingo.getMonth() + 1, domingo.getDate(), sabado.getDate(),
      sabado.getMonth() + 1, domingo.getDate(), sabado.getDate()
    ];

    db.query(sql, params, (err, results) => {
      if (err) {
        console.error('Error en consulta semanal:', err);
        return res.status(500).json({ error: 'Error al obtener cumpleaños semanales' });
      }
      res.json(results);
    });
  } else {
    // Filtro por mes (existente)
    const mes = parseInt(req.query.mes) || hoy.getMonth() + 1;
    const sql = `
      SELECT id, name, lastname, birthday, photo,
      TIMESTAMPDIFF(YEAR, birthday, CURDATE()) AS edad
      FROM application
      WHERE MONTH(birthday) = ?
      ORDER BY DAY(birthday)
    `;
    
    db.query(sql, [mes], (err, results) => {
      if (err) {
        console.error('Error en consulta mensual:', err);
        return res.status(500).json({ error: 'Error al obtener cumpleaños mensuales' });
      }
      res.json(results);
    });
  }
};

