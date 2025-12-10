/**
 * TESTS UNITARIOS - SERVICIO DE INTERÉS
 * UT-01: Pruebas de cálculo de interés compuesto
 */

const { calcularInteresCompuesto } = require('../src/services/interestService');

describe('Servicio de Interés Compuesto', () => {
  
  test('UT-01.1 - Calcular interés categoría A (1% mensual)', () => {
    const resultado = calcularInteresCompuesto(1000, 12, 'A');
    
    expect(resultado.categoria).toBe('A');
    expect(resultado.tasa_interes).toBe(1);
    expect(resultado.saldo_final).toBeCloseTo(1126.83, 2);
    expect(resultado.interes_total).toBeCloseTo(126.83, 2);
  });

  test('UT-01.2 - Calcular interés categoría B (2% mensual)', () => {
    const resultado = calcularInteresCompuesto(1000, 12, 'B');
    
    expect(resultado.categoria).toBe('B');
    expect(resultado.tasa_interes).toBe(2);
    expect(resultado.saldo_final).toBeCloseTo(1268.24, 2);
    expect(resultado.interes_total).toBeCloseTo(268.24, 2);
  });

  test('UT-01.3 - Calcular interés categoría C (3.5% mensual)', () => {
    const resultado = calcularInteresCompuesto(1000, 12, 'C');
    
    expect(resultado.categoria).toBe('C');
    expect(resultado.tasa_interes).toBeCloseTo(3.5, 1);
    expect(resultado.saldo_final).toBeCloseTo(1511.07, 2);
    expect(resultado.interes_total).toBeCloseTo(511.07, 2);
  });

  test('UT-01.4 - Monto de 5000 con plazo de 24 meses, categoría A', () => {
    const resultado = calcularInteresCompuesto(5000, 24, 'A');
    
    expect(resultado.saldo_final).toBeGreaterThan(5000);
    expect(resultado.interes_total).toBeGreaterThan(0);
  });

  test('UT-01.5 - Plazo cero debe devolver el mismo monto', () => {
    const resultado = calcularInteresCompuesto(1000, 0, 'A');
    
    expect(resultado.saldo_final).toBe(1000);
    expect(resultado.interes_total).toBe(0);
  });

  test('UT-01.6 - Categoría inválida debe usar tasa por defecto (C)', () => {
    const resultado = calcularInteresCompuesto(1000, 12, 'X');
    
    // Debe usar la tasa de categoría C (3.5%)
    expect(resultado.categoria).toBe('X');
    expect(resultado.tasa_interes).toBeCloseTo(3.5, 1);
    expect(resultado.saldo_final).toBeCloseTo(1511.07, 2);
    expect(resultado.interes_total).toBeCloseTo(511.07, 2);
  });
});
