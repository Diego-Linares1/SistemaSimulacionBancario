/**
 * CONTROLADOR DE AUTENTICACIÓN
 */

const bcrypt = require('bcryptjs');
const { generateToken } = require('../middleware/auth');
const pool = require('../config/database');

/**
 * Login de usuario
 */
async function login(req, res) {
  const { username, password } = req.body;

  try {
    // Validar campos
    if (!username || !password) {
      return res.status(400).json({ error: 'Usuario y contraseña requeridos' });
    }

    // Buscar usuario
    const query = 'SELECT id, nombre, username, password_hash, role FROM usuarios WHERE username = $1';
    const result = await pool.query(query, [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = result.rows[0];

    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generar JWT
    const token = generateToken(user);

    res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id: user.id,
        nombre: user.nombre,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error al login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });
  }
}

/**
 * Registrar nuevo usuario
 */
async function register(req, res) {
  const { nombre, username, password, role } = req.body;

  try {
    // Validar campos
    if (!nombre || !username || !password || !role) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    // Validar rol
    if (!['cliente', 'analista', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Rol no válido. Roles permitidos: cliente, analista, admin' });
    }

    // Verificar si usuario existe
    const checkQuery = 'SELECT id FROM usuarios WHERE username = $1';
    const checkResult = await pool.query(checkQuery, [username]);

    if (checkResult.rows.length > 0) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    // Hashear contraseña
    const password_hash = await bcrypt.hash(password, 10);

    // Insertar usuario
    const insertQuery = `
      INSERT INTO usuarios (nombre, username, password_hash, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, nombre, username, role
    `;

    const result = await pool.query(insertQuery, [nombre, username, password_hash, role]);

    res.status(201).json({
      mensaje: 'Usuario registrado exitosamente',
      usuario: result.rows[0]
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
}

module.exports = {
  login,
  register
};
