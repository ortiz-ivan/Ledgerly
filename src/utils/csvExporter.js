const fs = require('fs');
const { createObjectCsvWriter } = require('csv-writer');
const path = require('path');

/**
 * Exporta un array de objetos a CSV
 * @param {Array<Object>} datos
 * @param {string} rutaArchivo
 */
async function exportarCSV(datos, rutaArchivo) {
  if (!Array.isArray(datos) || datos.length === 0) {
    throw new Error('No hay datos para exportar.');
  }

  // Generar headers dinámicamente a partir de las keys del primer objeto
  const headers = Object.keys(datos[0]).map(key => ({
    id: key,
    title: key.toUpperCase()
  }));

  const rutaFinal = path.resolve(rutaArchivo);
  
  // Crear directorio si no existe
  try {
    const dir = path.dirname(rutaFinal);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch (error) {
    console.error('Error al crear directorio:', error);
    throw error;
  }

  const csvWriter = createObjectCsvWriter({
    path: rutaFinal,
    header: headers
  });

  try {
    await csvWriter.writeRecords(datos);
    console.log(`CSV exportado correctamente a: ${rutaFinal}`);
  } catch (error) {
    console.error('Error al exportar CSV:', error);
    throw error;
  }
}

module.exports = {
  exportarCSV
};
