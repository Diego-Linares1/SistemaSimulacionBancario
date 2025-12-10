/**
 * RUTAS DE AUTENTICACIÓN
 */

const express = require('express');
const router = express.Router();
const { login, register } = require('../controllers/authController');

// POST /auth/login
router.post('/login', login);

// POST /auth/register
router.post('/register', register);

module.exports = router;
