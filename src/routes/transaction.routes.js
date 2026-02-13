const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction.controller');
const { validarTransaccion } = require('../utils/validators');

// Crear transacción
router.post('/', validarTransaccion, (req, res) => transactionController.crearTransaccion(req, res));

// Listar todas las transacciones
router.get('/', (req, res) => transactionController.listarTodas(req, res));

// Rutas estáticas primero (IMPORTANTE: antes que las rutas dinámicas)
// Listar categorías
router.get('/categorias/lista', (req, res) => transactionController.listarCategorias(req, res));

// Balance por mes (histórico)
router.get('/balance/historial', (req, res) => transactionController.obtenerBalancePorMes(req, res));

// Exportar CSV
router.get('/exportar/csv', (req, res) => transactionController.exportarTransacciones(req, res));

// Rutas dinámicas después (capturan :anioMes)
// Gastos por categoría
router.get('/:anioMes/gastos-por-categoria', (req, res) => transactionController.obtenerGastosPorCategoria(req, res));

// Obtener balance mensual
router.get('/:anioMes/balance', (req, res) => transactionController.obtenerBalanceMensual(req, res));

// Listar transacciones por mes (DEBE SER LA ÚLTIMA ruta dinámica)
router.get('/:anioMes', (req, res) => transactionController.listarPorMes(req, res));

module.exports = router;
