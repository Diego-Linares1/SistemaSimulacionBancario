/**
 * SERVICIO DE CIFRADO
 * Cifra y descifra datos sensibles como DNI
 */

const CryptoJS = require('crypto-js');
require('dotenv').config();

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'default_encryption_key_32_chars_';

/**
 * Cifra un texto usando AES
 * @param {string} text - Texto a cifrar
 * @returns {string} Texto cifrado en base64
 */
function encryptDNI(text) {
  try {
    const encrypted = CryptoJS.AES.encrypt(text.toString(), ENCRYPTION_KEY).toString();
    return encrypted;
  } catch (error) {
    console.error('Error al cifrar DNI:', error);
    throw new Error('Error al cifrar datos sensibles');
  }
}

/**
 * Descifra un texto cifrado con AES
 * @param {string} encryptedText - Texto cifrado
 * @returns {string} Texto descifrado
 */
function decryptDNI(encryptedText) {
  try {
    const decrypted = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY).toString(CryptoJS.enc.Utf8);
    return decrypted;
  } catch (error) {
    console.error('Error al descifrar DNI:', error);
    throw new Error('Error al descifrar datos sensibles');
  }
}

module.exports = {
  encryptDNI,
  decryptDNI
};
