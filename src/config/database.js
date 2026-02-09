const path = require('path');
const Database = require('better-sqlite3');
const fs = require('fs');

// Ruta absoluta a la base de datos
const rutaBaseDatos = path.join(__dirname, '../db/database.sqlite');

// Inicializar conexión
const db = new Database(rutaBaseDatos, {
  verbose: process.env.NODE_ENV === 'development' ? console.log : null
});

// Activar claves foráneas en SQLite
db.pragma('foreign_keys = ON');

// Ejecutar migraciones automáticamente
function ejecutarMigraciones() {
  const rutaMigraciones = path.join(__dirname, '../db/migrations.sql');

  if (!fs.existsSync(rutaMigraciones)) {
    throw new Error('Archivo migrations.sql no encontrado');
  }

  const sqlMigraciones = fs.readFileSync(rutaMigraciones, 'utf-8');
  db.exec(sqlMigraciones);

  // Ejecutar seed si existe
  const rutaSeed = path.join(__dirname, '../db/seed.sql');
  if (fs.existsSync(rutaSeed)) {
    const sqlSeed = fs.readFileSync(rutaSeed, 'utf-8');
    db.exec(sqlSeed);
  }
}

// Ejecutar migraciones al iniciar
ejecutarMigraciones();

module.exports = db;
