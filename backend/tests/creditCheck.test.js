/**
 * TESTS UNITARIOS - CREDIT CHECK
 * TEST DE STUB
 */

const { checkCredit } = require('../src/services/creditCheckService');

describe('Servicio de Credit Check (Stub)', () => {
  
  test('STUB-01.1 - DNI de prueba 12345678 debe devolver categoría A', () => {
    const result = checkCredit('12345678');
    
    expect(result.categoria).toBe('A');
    expect(result.score).toBe(850);
    expect(result.estado).toBe('VERIFICADO');
  });

  test('STUB-01.2 - DNI de prueba 87654321 debe devolver categoría B', () => {
    const result = checkCredit('87654321');
    
    expect(result.categoria).toBe('B');
    expect(result.score).toBe(650);
    expect(result.estado).toBe('VERIFICADO');
  });

  test('STUB-01.3 - DNI de prueba 11111111 debe devolver categoría C', () => {
    const result = checkCredit('11111111');
    
    expect(result.categoria).toBe('C');
    expect(result.score).toBe(400);
    expect(result.estado).toBe('VERIFICADO');
  });

  test('STUB-01.4 - DNI desconocido debe devolver un score aleatorio válido', () => {
    const result = checkCredit('99999999');
    
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(1000);
    expect(['A', 'B', 'C']).toContain(result.categoria);
    expect(result.estado).toBe('VERIFICADO');
  });

  test('STUB-01.5 - Debe incluir timestamp en respuesta', () => {
    const result = checkCredit('12345678');
    
    expect(result.timestamp).toBeDefined();
    expect(new Date(result.timestamp)).toBeInstanceOf(Date);
  });
});
