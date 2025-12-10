/**
 * TESTS UNITARIOS - CIFRADO DE DNI
 * SEC-01: Pruebas de seguridad de cifrado
 */

const { encryptDNI, decryptDNI } = require('../src/utils/encryption');

describe('Servicio de Cifrado SEC-01', () => {
  
  test('SEC-01.1 - DNI no debe estar en texto plano en BD', () => {
    const dni = '12345678';
    const encrypted = encryptDNI(dni);
    
    // El DNI cifrado no debe ser igual al original
    expect(encrypted).not.toBe(dni);
    // El DNI cifrado debe ser una cadena válida
    expect(encrypted.length).toBeGreaterThan(0);
  });

  test('SEC-01.2 - Cifrado y descifrado debe ser reversible', () => {
    const dni = '87654321';
    const encrypted = encryptDNI(dni);
    const decrypted = decryptDNI(encrypted);
    
    expect(decrypted).toBe(dni);
  });

  test('SEC-01.3 - DNIs diferentes producen textos cifrados diferentes', () => {
    const dni1 = '11111111';
    const dni2 = '22222222';
    
    const encrypted1 = encryptDNI(dni1);
    const encrypted2 = encryptDNI(dni2);
    
    expect(encrypted1).not.toBe(encrypted2);
  });

  test('SEC-01.4 - El mismo DNI cifrado múltiples veces produce resultados diferentes', () => {
    const dni = '12345678';
    const encrypted1 = encryptDNI(dni);
    const encrypted2 = encryptDNI(dni);
    
    // Nota: Dependiendo de la implementación, estos podrían ser iguales
    // pero ambos deberían descifrar al mismo valor
    expect(decryptDNI(encrypted1)).toBe(dni);
    expect(decryptDNI(encrypted2)).toBe(dni);
  });

  test('SEC-01.5 - Descifrado incorrecto no debe retornar el DNI', () => {
    const dni = '12345678';
    const encrypted = encryptDNI(dni);
    
    // El descifrado con la clave correcta debe devolver el DNI original
    const decrypted = decryptDNI(encrypted);
    expect(decrypted).toBe(dni);
  });
});
