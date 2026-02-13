// Configuración de moneda - Guaraníes Paraguayos (PYG)
const CURRENCY_CONFIG = {
  code: 'PYG',
  symbol: '₲',
  locale: 'es-PY',
  options: {
    style: 'currency',
    currency: 'PYG',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }
};

/**
 * Formatea un número a moneda en guaraníes
 * @param {number} valor
 * @returns {string}
 */
function formatearMoneda(valor) {
  if (typeof valor !== 'number' || isNaN(valor)) {
    return '₲ 0';
  }
  return new Intl.NumberFormat(CURRENCY_CONFIG.locale, CURRENCY_CONFIG.options).format(valor);
}

/**
 * Retorna el símbolo de la moneda
 * @returns {string}
 */
function obtenerSimboloMoneda() {
  return CURRENCY_CONFIG.symbol;
}
