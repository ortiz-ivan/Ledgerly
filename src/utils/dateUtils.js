const { parseISO, isValid, format } = require('date-fns');

/**
 * Verifica si una fecha es válida y está en formato YYYY-MM-DD
 * @param {string} fecha
 * @returns {boolean}
 */
function esFechaValida(fecha) {
  if (typeof fecha !== 'string') return false;

  const fechaParseada = parseISO(fecha);
  return isValid(fechaParseada) && format(fechaParseada, 'yyyy-MM-dd') === fecha;
}

/**
 * Formatea una fecha a YYYY-MM-DD
 * @param {Date|string} fecha
 * @returns {string}
 */
function formatearFecha(fecha) {
  const fechaObj = fecha instanceof Date ? fecha : parseISO(fecha);
  if (!isValid(fechaObj)) throw new Error('Fecha inválida');
  return format(fechaObj, 'yyyy-MM-dd');
}

module.exports = {
  esFechaValida,
  formatearFecha
};
