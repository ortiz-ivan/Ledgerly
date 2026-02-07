const API_URL = 'http://localhost:3000/api/transacciones';

const form = document.getElementById('transaction-form');
const tableBody = document.querySelector('#transactions-table tbody');

// Función para obtener transacciones
async function fetchTransactions() {
  const res = await fetch(`${API_URL}?pagina=1&limite=20`);
  const data = await res.json();
  renderTransactions(data);
}

// Renderizar en la tabla
function renderTransactions(transactions) {
  tableBody.innerHTML = '';
  transactions.forEach(t => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${t.tipo}</td>
      <td>${t.monto}</td>
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
    categoria_id: null
  };

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (res.ok) {
    fetchTransactions();
    form.reset();
  } else {
    const error = await res.json();
    alert(error.error);
  }
});

// Inicializar tabla
fetchTransactions();
