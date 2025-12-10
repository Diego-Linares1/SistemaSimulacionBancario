/**
 * RUTAS DE SOLICITUDES DE PRÉSTAMO
 */

const express = require('express');
const router = express.Router();
const { verifyToken, checkRole, checkRoles } = require('../middleware/auth');
const {
  createLoanRequest,
  getAllLoanRequests,
  getMyLoanRequests,
  getLoanRequestById,
  updateLoanRequest
} = require('../controllers/loanController');

// POST /loans - Crear nueva solicitud (solo clientes)
router.post('/', verifyToken, checkRole('cliente'), createLoanRequest);

// GET /loans/my - Obtener mis solicitudes (cliente autenticado) - DEBE IR ANTES DE /:id
router.get('/my', verifyToken, checkRole('cliente'), getMyLoanRequests);

// GET /loans - Obtener todas las solicitudes (admin y analistas)
router.get('/', verifyToken, checkRoles(['admin', 'analista']), getAllLoanRequests);

// GET /loans/:id - Obtener solicitud específica
router.get('/:id', getLoanRequestById);

// PUT /loans/:id - Actualizar solicitud (admin y analistas)
router.put('/:id', verifyToken, checkRoles(['admin', 'analista']), updateLoanRequest);

module.exports = router;
