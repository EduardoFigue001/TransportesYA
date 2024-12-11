// Importar CryptoJS
const CryptoJS = require('crypto-js');

/**
 * Función para generar un hash SHA-256 de una cadena.
 * @param {string} data - El texto que deseas hashear.
 * @returns {string} - El hash generado.
 */
function generarHash(data) {
  if (!data) {
    throw new Error('El dato para hashear no puede estar vacío.');
  }
  return CryptoJS.SHA256(data).toString();
}

/**
 * Función para comparar un hash con un texto sin procesar.
 * @param {string} rawData - El texto original.
 * @param {string} hashedData - El hash con el cual comparar.
 * @returns {boolean} - Retorna `true` si coinciden, `false` de lo contrario.
 */
function validarHash(rawData, hashedData) {
  const nuevoHash = generarHash(rawData);
  return nuevoHash === hashedData;
}

// Exportar las funciones para ser usadas en otras partes del proyecto
module.exports = {
  generarHash,
  validarHash,
};
