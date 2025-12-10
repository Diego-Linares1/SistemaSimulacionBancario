/**
 * SERVICIO DE CÁLCULO DE INTERÉS
 * Implementa la fórmula: Saldo_Final = Monto X (1 + r)^n
 * Donde r depende del score de crédito
 */

/**
 * Calcula el interés compuesto según el score de crédito
 * @param {number} monto - Monto del préstamo
 * @param {number} plazo - Plazo en meses
 * @param {string} categoria - Categoría de crédito (A, B, C)
 * @returns {object} { saldo_final, tasa_interes, interes_total }
 */
function calcularInteresCompuesto(monto, plazo, categoria) {
  // Tasas según categoría
  const tasas = {
    'A': 0.01,    // 1% mensual
    'B': 0.02,    // 2% mensual
    'C': 0.035    // 3.5% mensual
  };

  const tasa = tasas[categoria] || tasas['C'];
  
  // Fórmula: Saldo_Final = Monto X (1 + r)^n
  const saldo_final = monto * Math.pow(1 + tasa, plazo);
  const interes_total = saldo_final - monto;

  return {
    saldo_final: Math.round(saldo_final * 100) / 100,
    tasa_interes: tasa * 100,
    interes_total: Math.round(interes_total * 100) / 100,
    categoria
  };
}

module.exports = {
  calcularInteresCompuesto
};
