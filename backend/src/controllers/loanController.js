/**
 * CONTROLADOR DE SOLICITUDES DE PRÉSTAMO
 */

const pool = require('../config/database');
const { checkCredit } = require('../services/creditCheckService');
const { calcularInteresCompuesto } = require('../services/interestService');
const { validarMonto } = require('../services/validationService');
const { encryptDNI, decryptDNI } = require('../utils/encryption');

/**
 * Crear una nueva solicitud de préstamo
 */
async function createLoanRequest(req, res) {
  const { nombre, apellido, dni, ingreso, monto, plazo } = req.body;

  try {
    // Validar campos requeridos
    if (!nombre || !apellido || !dni || !ingreso || !monto || !plazo) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    // Validar monto
    const validacion = validarMonto(monto, ingreso);
    if (!validacion.valido) {
      return res.status(400).json({
        error: 'Monto solicitado no válido',
        detalle: validacion.motivo
      });
    }

    // Obtener score de crédito
    const creditInfo = checkCredit(dni);

    // Calcular interés
    const interesInfo = calcularInteresCompuesto(monto, plazo, creditInfo.categoria);

    // Cifrar DNI antes de guardar
    const dniEncrypted = encryptDNI(dni);

    // Insertar en base de datos
    const query = `
      INSERT INTO solicitudes (user_id, nombre, apellido, dni_encriptado, ingreso, monto, plazo, categoria_credito, score_credito, saldo_final, revision_manual, estado)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id, nombre, apellido, monto, plazo, estado, categoria_credito, score_credito
    `;

    const values = [
      req.user.id, // ID del usuario autenticado
      nombre,
      apellido,
      dniEncrypted,
      ingreso,
      monto,
      plazo,
      creditInfo.categoria,
      creditInfo.score,
      interesInfo.saldo_final,
      validacion.revision_manual,
      'PENDIENTE'
    ];

    const result = await pool.query(query, values);

    res.status(201).json({
      mensaje: 'Solicitud creada exitosamente',
      solicitud: {
        ...result.rows[0],
        interes_total: interesInfo.interes_total,
        tasa_interes: interesInfo.tasa_interes
      }
    });
  } catch (error) {
    console.error('Error al crear solicitud:', error);
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
}

/**
 * Obtener todas las solicitudes (solo admin y analista)
 */
async function getAllLoanRequests(req, res) {
  try {
    const query = `
      SELECT id, nombre, apellido, ingreso, monto, plazo, categoria_credito, score_credito, saldo_final, revision_manual, estado, created_at
      FROM solicitudes
      ORDER BY created_at DESC
    `;

    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener solicitudes:', error);
    res.status(500).json({ error: 'Error al obtener solicitudes' });
  }
}

/**
 * Obtener solicitudes del usuario autenticado (solo cliente)
 */
async function getMyLoanRequests(req, res) {
  try {
    const userId = req.user.id;
    
    const query = `
      SELECT id, nombre, apellido, ingreso, monto, plazo, categoria_credito, score_credito, saldo_final, estado, created_at
      FROM solicitudes
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;

    const result = await pool.query(query, [userId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener mis solicitudes:', error);
    res.status(500).json({ error: 'Error al obtener solicitudes' });
  }
}

/**
 * Obtener una solicitud específica
 */
async function getLoanRequestById(req, res) {
  const { id } = req.params;

  try {
    const query = `
      SELECT id, nombre, apellido, ingreso, monto, plazo, categoria_credito, score_credito, saldo_final, revision_manual, estado, created_at
      FROM solicitudes
      WHERE id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener solicitud:', error);
    res.status(500).json({ error: 'Error al obtener solicitud' });
  }
}

/**
 * Actualizar estado de una solicitud (Aprobar/Rechazar)
 */
async function updateLoanRequest(req, res) {
  const { id } = req.params;
  const { estado, motivo_rechazo } = req.body;

  try {
    // Validar estado
    if (!['APROBADA', 'RECHAZADA'].includes(estado)) {
      return res.status(400).json({ error: 'Estado no válido' });
    }

    const query = `
      UPDATE solicitudes
      SET estado = $1, motivo_rechazo = $2, updated_at = NOW()
      WHERE id = $3
      RETURNING id, estado, nombre, apellido
    `;

    const values = [estado, motivo_rechazo || null, id];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    res.json({
      mensaje: `Solicitud ${estado.toLowerCase()}`,
      solicitud: result.rows[0]
    });
  } catch (error) {
    console.error('Error al actualizar solicitud:', error);
    res.status(500).json({ error: 'Error al actualizar solicitud' });
  }
}

module.exports = {
  createLoanRequest,
  getAllLoanRequests,
  getMyLoanRequests,
  getLoanRequestById,
  updateLoanRequest
};
