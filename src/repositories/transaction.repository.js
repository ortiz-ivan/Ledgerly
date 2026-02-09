const db = require('../config/database');

class TransactionRepository {

  /**
   * Crear una nueva transacción
   * @param {Object} transaccion
   * @param {'INGRESO'|'EGRESO'} transaccion.tipo
   * @param {number} transaccion.monto
   * @param {string} transaccion.descripcion
   * @param {string} transaccion.fecha - formato YYYY-MM-DD
   * @param {number|null} transaccion.categoria_id
   * @returns {number} id de la transacción creada
   */
  crear({ tipo, monto, descripcion, fecha, categoria_id = null }) {
    const stmt = db.prepare(`
      INSERT INTO transacciones (tipo, monto, descripcion, fecha, categoria_id)
      VALUES (?, ?, ?, ?, ?)
    `);
    const info = stmt.run(tipo, monto, descripcion, fecha, categoria_id);
    return info.lastInsertRowid;
  }

  /**
   * Obtener todas las transacciones con paginación
   * @param {Object} opciones
   * @param {number} opciones.pagina - número de página (1 por defecto)
   * @param {number} opciones.limite - cantidad de registros por página (20 por defecto)
   * @returns {Array<Object>}
   */
  listarTodas({ pagina = 1, limite = 20 } = {}) {
    const offset = (pagina - 1) * limite;

    const stmt = db.prepare(`
      SELECT t.id, t.tipo, t.monto, t.descripcion, t.fecha, t.categoria_id, c.nombre AS categoria
      FROM transacciones t
      LEFT JOIN categorias c ON t.categoria_id = c.id
      ORDER BY t.fecha DESC
      LIMIT ? OFFSET ?
    `);
    return stmt.all(limite, offset);
  }

  /**
   * Obtener transacciones por mes con paginación
   * @param {string} anioMes - formato 'YYYY-MM'
   * @param {Object} opciones
   * @param {number} opciones.pagina - número de página (1 por defecto)
   * @param {number} opciones.limite - cantidad de registros por página (20 por defecto)
   * @returns {Array<Object>}
   */
  listarPorMes(anioMes, { pagina = 1, limite = 20 } = {}) {
    const offset = (pagina - 1) * limite;

    const stmt = db.prepare(`
      SELECT t.id, t.tipo, t.monto, t.descripcion, t.fecha, t.categoria_id, c.nombre AS categoria
      FROM transacciones t
      LEFT JOIN categorias c ON t.categoria_id = c.id
      WHERE strftime('%Y-%m', t.fecha) = ?
      ORDER BY t.fecha ASC
      LIMIT ? OFFSET ?
    `);
    return stmt.all(anioMes, limite, offset);
  }

  /**
   * Obtener balance mensual
   * @param {string} anioMes - formato 'YYYY-MM'
   * @returns {Object} { ingresos: number, egresos: number, balance: number }
   */
  obtenerBalanceMensual(anioMes) {
    const stmt = db.prepare(`
      SELECT tipo, SUM(monto) AS total
      FROM transacciones
      WHERE strftime('%Y-%m', fecha) = ?
      GROUP BY tipo
    `);
    const filas = stmt.all(anioMes);

    let ingresos = 0;
    let egresos = 0;

    filas.forEach(f => {
      if (f.tipo === 'INGRESO') ingresos = f.total;
      if (f.tipo === 'EGRESO') egresos = f.total;
    });

    return {
      ingresos,
      egresos,
      balance: ingresos - egresos
    };
  }

  /**
   * Obtener todas las categorías
   * @returns {Array<Object>}
   */
  listarCategorias() {
    const stmt = db.prepare(`
      SELECT id, nombre, descripcion
      FROM categorias
      ORDER BY nombre ASC
    `);
    return stmt.all();
  }

  /**
   * Obtener gastos agrupados por categoría para un mes
   * @param {string} anioMes - formato 'YYYY-MM'
   * @returns {Array<Object>} { categoria: string, total: number }
   */
  obtenerGastosPorCategoria(anioMes) {
    const stmt = db.prepare(`
      SELECT c.nombre AS categoria, SUM(t.monto) AS total
      FROM transacciones t
      LEFT JOIN categorias c ON t.categoria_id = c.id
      WHERE t.tipo = 'EGRESO'
        AND strftime('%Y-%m', t.fecha) = ?
      GROUP BY t.categoria_id
      ORDER BY total DESC
    `);
    return stmt.all(anioMes);
  }

  /**
   * Obtener balance por mes (últimos 12 meses)
   * @returns {Array<Object>} { mes: string, ingresos: number, egresos: number, balance: number }
   */
  obtenerBalancePorMes() {
    const stmt = db.prepare(`
      SELECT 
        strftime('%Y-%m', fecha) AS mes,
        SUM(CASE WHEN tipo = 'INGRESO' THEN monto ELSE 0 END) AS ingresos,
        SUM(CASE WHEN tipo = 'EGRESO' THEN monto ELSE 0 END) AS egresos
      FROM transacciones
      WHERE fecha >= date('now', '-12 months')
      GROUP BY strftime('%Y-%m', fecha)
      ORDER BY mes ASC
    `);
    return stmt.all();
  }

  /**
   * Obtener transacciones en un rango de fechas
   * @param {string} fechaInicio - formato YYYY-MM-DD
   * @param {string} fechaFin - formato YYYY-MM-DD
   * @returns {Array<Object>}
   */
  listarPorRangoFechas(fechaInicio, fechaFin) {
    const stmt = db.prepare(`
      SELECT t.id, t.tipo, t.monto, t.descripcion, t.fecha, t.categoria_id, c.nombre AS categoria
      FROM transacciones t
      LEFT JOIN categorias c ON t.categoria_id = c.id
      WHERE t.fecha >= ? AND t.fecha <= ?
      ORDER BY t.fecha DESC
    `);
    return stmt.all(fechaInicio, fechaFin);
  }

}

module.exports = new TransactionRepository();
