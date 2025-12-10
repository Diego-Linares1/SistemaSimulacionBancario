/**
 * TESTS UNITARIOS - VALIDACIÓN DE MONTOS
 * UT-02: Pruebas de validación de montos
 */

const { validarMonto } = require('../src/services/validationService');

describe('Servicio de Validación de Montos', () => {
  
  test('UT-02.1 - Monto dentro de límites (1x ingreso) - No requiere revisión', () => {
    const resultado = validarMonto(1000, 2000);
    
    expect(resultado.valido).toBe(true);
    expect(resultado.revision_manual).toBe(false);
  });

  test('UT-02.2 - Monto en límite máximo automático (5x ingreso) - No requiere revisión', () => {
    const resultado = validarMonto(5000, 1000);
    
    expect(resultado.valido).toBe(true);
    expect(resultado.revision_manual).toBe(false);
  });

  test('UT-02.3 - Monto entre 5x y 10x ingreso - Requiere revisión manual', () => {
    const resultado = validarMonto(7500, 1000);
    
    expect(resultado.valido).toBe(true);
    expect(resultado.revision_manual).toBe(true);
  });

  test('UT-02.4 - Monto en límite máximo con revisión (10x ingreso) - Requiere revisión', () => {
    const resultado = validarMonto(10000, 1000);
    
    expect(resultado.valido).toBe(true);
    expect(resultado.revision_manual).toBe(true);
  });

  test('UT-02.5 - Monto superior a 10x ingreso - Rechazado', () => {
    const resultado = validarMonto(11000, 1000);
    
    expect(resultado.valido).toBe(false);
    expect(resultado.revision_manual).toBe(true);
  });

  test('UT-02.6 - Monto mucho mayor a 10x ingreso - Rechazado', () => {
    const resultado = validarMonto(50000, 1000);
    
    expect(resultado.valido).toBe(false);
    expect(resultado.revision_manual).toBe(true);
  });

  test('UT-02.7 - Ingreso alto, monto bajo - Válido sin revisión', () => {
    const resultado = validarMonto(2000, 10000);
    
    expect(resultado.valido).toBe(true);
    expect(resultado.revision_manual).toBe(false);
  });
});
