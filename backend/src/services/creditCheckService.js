/**
 * STUB DE CREDIT CHECK
 * Simula una API externa que valida el crédito basado en DNI
 */

/**
 * Simula la respuesta de un servicio externo de credit check
 * @param {string} dni - Documento de identidad
 * @returns {object} { score, categoria, estado }
 */
function checkCredit(dni) {
  // Para testing: DNI específicos devuelven categorías conocidas
  const testDnis = {
    '12345678': { score: 850, categoria: 'A' },
    '87654321': { score: 650, categoria: 'B' },
    '11111111': { score: 400, categoria: 'C' }
  };

  // Si es un DNI de prueba, devolver resultado conocido
  if (testDnis[dni]) {
    return {
      ...testDnis[dni],
      estado: 'VERIFICADO',
      timestamp: new Date().toISOString()
    };
  }

  // Para otros DNIs, generar un score aleatorio
  const score = Math.floor(Math.random() * 1000);
  
  // Categorizar según score
  let categoria;
  if (score >= 700) {
    categoria = 'A';
  } else if (score >= 500) {
    categoria = 'B';
  } else {
    categoria = 'C';
  }

  return {
    score,
    categoria,
    estado: 'VERIFICADO',
    timestamp: new Date().toISOString()
  };
}

module.exports = {
  checkCredit
};
