const { esFechaValida } = require('./dateUtils');

/**
 * Middleware de Express para validar la creación de transacciones
 */
function validarTransaccion(req, res, next) {
  const { tipo, monto, descripcion, fecha, categoria_id } = req.body;

  if (!tipo || !['INGRESO', 'EGRESO'].includes(tipo)) {
    return res.status(400).json({ error: 'Tipo de transacción inválido (INGRESO o EGRESO)' });
  }

  if (typeof monto !== 'number' || monto <= 0) {
    return res.status(400).json({ error: 'Monto inválido, debe ser un número mayor a 0' });
  }

  if (!fecha || !esFechaValida(fecha)) {
    return res.status(400).json({ error: 'Fecha inválida. Formato requerido: YYYY-MM-DD' });
  }

  if (descripcion && descripcion.length > 255) {
    return res.status(400).json({ error: 'La descripción no puede superar 255 caracteres' });
  }

  if (categoria_id !== null && typeof categoria_id !== 'number') {
    return res.status(400).json({ error: 'categoria_id debe ser un número o null' });
  }

  next();
}

module.exports = {
  validarTransaccion
};
