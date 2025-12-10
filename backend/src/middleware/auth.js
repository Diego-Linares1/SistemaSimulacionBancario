/**
 * MIDDLEWARE DE AUTENTICACIÓN
 * Valida JWT y roles de usuario
 */

const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Middleware para verificar JWT
 */
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

/**
 * Middleware para verificar rol de usuario
 */
function checkRole(requiredRole) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== requiredRole) {
      return res.status(403).json({ error: `Acceso denegado. Se requiere rol: ${requiredRole}` });
    }
    next();
  };
}

/**
 * Middleware para verificar múltiples roles
 */
function checkRoles(allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: `Acceso denegado. Se requiere uno de estos roles: ${allowedRoles.join(', ')}` });
    }
    next();
  };
}

/**
 * Genera un JWT
 */
function generateToken(user) {
  return jwt.sign(
    { id: user.id, nombre: user.nombre, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
}

module.exports = {
  verifyToken,
  checkRole,
  checkRoles,
  generateToken
};
