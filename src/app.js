const express = require('express');
const cors = require('cors');
const path = require('path');
const transactionRoutes = require('./routes/transaction.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Permite requests desde el frontend
app.use(express.json()); // Parseo de JSON automáticamente

// Servir archivos estáticos del frontend (carpeta ui)
app.use(express.static(path.join(__dirname, 'ui')));

// Rutas API
app.use('/api/transacciones', transactionRoutes);

// Ruta raíz - carga index.html automáticamente
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Levantar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
