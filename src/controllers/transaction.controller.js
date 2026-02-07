const transactionService = require('../services/transaction.service');

class TransactionController {

  // Crear una transacción
  crearTransaccion(req, res) {
    try {
      const id = transactionService.crearTransaccion(req.body);
      res.status(201).json({ mensaje: 'Transacción creada', id });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Listar todas las transacciones con paginación
  listarTodas(req, res) {
    try {
      const pagina = parseInt(req.query.pagina) || 1;
      const limite = parseInt(req.query.limite) || 20;
      const transacciones = transactionService.listarTodas({ pagina, limite });
      res.json(transacciones);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Listar transacciones de un mes específico con paginación
  listarPorMes(req, res) {
    try {
      const { anioMes } = req.params;
      const pagina = parseInt(req.query.pagina) || 1;
      const limite = parseInt(req.query.limite) || 20;
      const transacciones = transactionService.listarPorMes(anioMes, { pagina, limite });
      res.json(transacciones);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Obtener balance mensual
  obtenerBalanceMensual(req, res) {
    try {
      const { anioMes } = req.params;
      const balance = transactionService.obtenerBalanceMensual(anioMes);
      res.json(balance);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Exportar CSV de transacciones
  exportarTransacciones(req, res) {
    try {
      const transacciones = transactionService.listarTodas({ pagina: 1, limite: 1000 }); // Ajustable
      const rutaArchivo = './exportaciones/transacciones.csv';
      transactionService.exportarACSV(transacciones, rutaArchivo);
      res.json({ mensaje: 'CSV exportado correctamente', ruta: rutaArchivo });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

}

module.exports = new TransactionController();
