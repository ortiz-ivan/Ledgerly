const transactionRepo = require('../repositories/transaction.repository');
const { esFechaValida } = require('../utils/dateUtils');

class TransactionService {

  /**
   * Crear una transacción validando datos
   * @param {Object} transaccion
   * @param {'INGRESO'|'EGRESO'} transaccion.tipo
   * @param {number} transaccion.monto
   * @param {string} transaccion.descripcion
   * @param {string} transaccion.fecha - formato YYYY-MM-DD
   * @param {number|null} transaccion.categoria_id
   * @returns {number} id de la transacción creada
   */
  crearTransaccion(transaccion) {
    const { tipo, monto, descripcion, fecha, categoria_id = null } = transaccion;

    // Validaciones básicas
    if (!['INGRESO', 'EGRESO'].includes(tipo)) {
      throw new Error('Tipo de transacción inválido. Debe ser INGRESO o EGRESO.');
    }

    if (typeof monto !== 'number' || monto <= 0) {
      throw new Error('El monto debe ser un número mayor a cero.');
    }

    if (!esFechaValida(fecha)) {
      throw new Error('Formato de fecha inválido. Debe ser YYYY-MM-DD.');
    }

    if (descripcion && descripcion.length > 255) {
      throw new Error('La descripción no puede exceder 255 caracteres.');
    }

    // Aquí podrían agregarse reglas de negocio adicionales:
    // - Límite de gastos por categoría
    // - Alertas si balance mensual negativo
    // - Verificación de categoría existente
    // - Regla de transacciones duplicadas

    return transactionRepo.crear({ tipo, monto, descripcion, fecha, categoria_id });
  }

  /**
   * Listar todas las transacciones con paginación
   * @param {Object} opciones
   * @param {number} opciones.pagina
   * @param {number} opciones.limite
   */
  listarTodas({ pagina = 1, limite = 20 } = {}) {
    return transactionRepo.listarTodas({ pagina, limite });
  }

  /**
   * Listar transacciones de un mes específico con paginación
   * @param {string} anioMes - formato 'YYYY-MM'
   * @param {Object} opciones
   * @param {number} opciones.pagina
   * @param {number} opciones.limite
   */
  listarPorMes(anioMes, { pagina = 1, limite = 20 } = {}) {
    return transactionRepo.listarPorMes(anioMes, { pagina, limite });
  }

  /**
   * Obtener balance mensual
   * @param {string} anioMes - formato 'YYYY-MM'
   */
  obtenerBalanceMensual(anioMes) {
    return transactionRepo.obtenerBalanceMensual(anioMes);
  }

  /**
   * Exportar transacciones a CSV
   * @param {Array<Object>} transacciones
   * @param {string} rutaArchivo
   */
  exportarACSV(transacciones, rutaArchivo) {
    const { exportarCSV } = require('../utils/csvExporter');
    exportarCSV(transacciones, rutaArchivo);
  }

}

module.exports = new TransactionService();
