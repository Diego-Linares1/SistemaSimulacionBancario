/**
 * SERVICIO DE VALIDACIÓN DE MONTOS
 * Valida si un monto solicitado cumple con los requisitos
 */

/**
 * Valida el monto solicitado según el ingreso
 * @param {number} monto - Monto solicitado
 * @param {number} ingreso - Ingreso mensual
 * @returns {object} { valido, revision_manual, motivo }
 */
function validarMonto(monto, ingreso) {
  // Validación 1: Si monto > 10 * ingreso → Error
  if (monto > 10 * ingreso) {
    return {
      valido: false,
      revision_manual: true,
      motivo: 'Monto solicitado excede 10 veces el ingreso mensual',
      limite_maximo: 10 * ingreso
    };
  }

  // Validación 2: Si monto > 5 * ingreso → Revisión manual
  if (monto > 5 * ingreso) {
    return {
      valido: true,
      revision_manual: true,
      motivo: 'Monto solicitado requiere revisión manual (entre 5x y 10x el ingreso)',
      limite_recomendado: 5 * ingreso
    };
  }

  // Validación 3: Si monto <= 5 * ingreso → Aprobado automático
  return {
    valido: true,
    revision_manual: false,
    motivo: 'Monto dentro de límites automáticos',
    limite_permitido: 5 * ingreso
  };
}

module.exports = {
  validarMonto
};
