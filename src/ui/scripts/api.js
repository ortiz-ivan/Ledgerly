const API_URL = 'http://localhost:3000/api/transacciones';

const form = document.getElementById('transaction-form');
const tableBody = document.querySelector('#transactions-table tbody');
const tipoSelect = document.getElementById('tipo');
const categoriaSelect = document.getElementById('categoria');
const exportBtn = document.getElementById('export-btn');
const fechaInicio = document.getElementById('fecha-inicio');
const fechaFin = document.getElementById('fecha-fin');

let categorias = [];
const categoriasIngresos = ['Salario', 'Extra', 'Freelance', 'Inversiones', 'Otro Ingreso'];
const categoriasEgresos = ['Alimentación', 'Transporte', 'Vivienda', 'Salud', 'Entretenimiento', 'Educación', 'Compras', 'Deudas', 'Otro Egreso'];

// Cargar categorías al iniciar
async function cargarCategorias() {
  try {
    const res = await fetch(`${API_URL}/categorias/lista`);
    categorias = await res.json();
    actualizarSelectoCategorias();
  } catch (error) {
    console.error('Error al cargar categorías:', error);
  }
}

// Actualizar el select de categorías según el tipo seleccionado
function actualizarSelectoCategorias() {
  categoriaSelect.innerHTML = '<option value="">Categoría</option>';

  const tipo = tipoSelect.value;
  let categoriasDisponibles = [];

  if (tipo === 'INGRESO') {
    categoriasDisponibles = categorias.filter(c => categoriasIngresos.includes(c.nombre));
  } else if (tipo === 'EGRESO') {
    categoriasDisponibles = categorias.filter(c => categoriasEgresos.includes(c.nombre));
  }

  categoriasDisponibles.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat.id;
    option.textContent = cat.nombre;
    categoriaSelect.appendChild(option);
  });
}

// Listener para cambio de tipo
tipoSelect.addEventListener('change', actualizarSelectoCategorias);

// Función para obtener transacciones
async function fetchTransactions() {
  try {
    const res = await fetch(`${API_URL}?pagina=1&limite=20`);
    const data = await res.json();
    renderTransactions(data);
  } catch (error) {
    console.error('Error al obtener transacciones:', error);
  }
}

// Renderizar en la tabla
function renderTransactions(transactions) {
  tableBody.innerHTML = '';
  transactions.forEach(t => {
    const row = document.createElement('tr');
    const tipoClase = t.tipo === 'INGRESO' ? 'ingreso' : 'egreso';
    row.classList.add(tipoClase);
    row.innerHTML = `
      <td><span class="badge ${tipoClase}">${t.tipo}</span></td>
      <td>${t.monto.toFixed(2)}</td>
      <td>${t.descripcion || '-'}</td>
      <td>${t.fecha}</td>
      <td>${t.categoria || '-'}</td>
    `;
    tableBody.appendChild(row);
  });
}

// Crear nueva transacción
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const body = {
    tipo: document.getElementById('tipo').value,
    monto: parseFloat(document.getElementById('monto').value),
    descripcion: document.getElementById('descripcion').value,
    fecha: document.getElementById('fecha').value,
    categoria_id: parseInt(document.getElementById('categoria').value) || null
  };

  if (!body.tipo || !body.monto || !body.fecha || !body.categoria_id) {
    alert('Por favor completa todos los campos requeridos');
    return;
  }

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (res.ok) {
      fetchTransactions();
      form.reset();
      categoriaSelect.innerHTML = '<option value="">Categoría</option>';
      // Recargar gráficos
      if (typeof renderChart === 'function') renderChart();
      if (typeof renderCategoryChart === 'function') renderCategoryChart();
      if (typeof renderHistoryChart === 'function') renderHistoryChart();
    } else {
      const error = await res.json();
      alert('Error: ' + error.error);
    }
  } catch (error) {
    console.error('Error al crear transacción:', error);
    alert('Error al crear la transacción');
  }
});

// Exportar CSV
exportBtn.addEventListener('click', async () => {
  try {
    let url = `${API_URL}/exportar/csv`;
    
    if (fechaInicio.value && fechaFin.value) {
      url += `?fechaInicio=${fechaInicio.value}&fechaFin=${fechaFin.value}`;
    }

    const res = await fetch(url);
    const data = await res.json();
    
    if (res.ok) {
      // Forzar descarga del archivo
      alert('CSV descargado correctamente: ' + data.ruta);
    } else {
      alert('Error: ' + data.error);
    }
  } catch (error) {
    console.error('Error al exportar CSV:', error);
    alert('Error al exportar CSV');
  }
});

// Inicializar
cargarCategorias();
fetchTransactions();

