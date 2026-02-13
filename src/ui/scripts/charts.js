const API_URL = 'http://localhost:3000/api/transacciones';

let balanceChartInstance = null;
let categoryChartInstance = null;
let historyChartInstance = null;

// Obtener balance del mes actual
async function fetchBalance() {
  const today = new Date();
  const mes = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  console.log('Obteniendo balance para:', mes);
  try {
    const res = await fetch(`${API_URL}/${mes}/balance`);
    const data = await res.json();
    console.log('Balance obtenido:', data);
    return data;
  } catch (error) {
    console.error('Error al obtener balance:', error);
    return { ingresos: 0, egresos: 0, balance: 0 };
  }
}

// Obtener gastos por categoría
async function fetchCategoryData() {
  const today = new Date();
  const mes = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  console.log('Obteniendo gastos por categoría para:', mes);
  try {
    const res = await fetch(`${API_URL}/${mes}/gastos-por-categoria`);
    const data = await res.json();
    console.log('Gastos por categoría obtenidos:', data);
    return data;
  } catch (error) {
    console.error('Error al obtener gastos por categoría:', error);
    return [];
  }
}

// Obtener balance histórico
async function fetchHistoryData() {
  console.log('Obteniendo balance histórico');
  try {
    const res = await fetch(`${API_URL}/balance/historial`);
    const data = await res.json();
    console.log('Balance histórico obtenido:', data);
    return data;
  } catch (error) {
    console.error('Error al obtener historial:', error);
    return [];
  }
}

// Renderizar gráfico de balance mensual
async function renderChart() {
  console.log('renderChart iniciando...');
  const balance = await fetchBalance();
  console.log('balance recibido en renderChart:', balance);
  const ctx = document.getElementById('balanceChart');
  console.log('ctx encontrado:', !!ctx);
  
  if (!ctx) {
    console.warn('No se encontró elemento balanceChart');
    return;
  }

  if (balanceChartInstance) {
    balanceChartInstance.destroy();
  }

  console.log('Creando gráfico de balance con datos:', balance);
  balanceChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Ingresos', 'Egresos'],
      datasets: [{
        label: 'Balance mensual',
        data: [balance.ingresos || 0, balance.egresos || 0],
        backgroundColor: ['#03dac6', '#cf6679'],
        borderRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: false },
        title: { display: false },
        tooltip: {
          callbacks: {
            label: function(context) {
              return formatearMoneda(context.raw || context.parsed.y || 0);
            }
          }
        }
      },
      scales: {
        y: { 
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return formatearMoneda(value);
            }
          }
        }
      }
    }
  });
  console.log('Gráfico de balance creado exitosamente');
}

// Renderizar gráfico de gastos por categoría
async function renderCategoryChart() {
  console.log('renderCategoryChart iniciando...');
  const data = await fetchCategoryData();
  console.log('data recibido en renderCategoryChart:', data);
  const ctx = document.getElementById('categoryChart');
  console.log('ctx encontrado:', !!ctx);
  
  if (!ctx || !data || data.length === 0) {
    console.warn('No hay datos o elemento no encontrado:', { ctx: !!ctx, data: data?.length });
    return;
  }

  if (categoryChartInstance) {
    categoryChartInstance.destroy();
  }

  const labels = data.map(d => d.categoria || 'Sin categoría').slice(0, 8);
  const values = data.map(d => d.total || 0).slice(0, 8);

  const colors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
    '#FF9F40', '#FF6384', '#C9CBCF'
  ];

  console.log('Creando gráfico de categoría con labels:', labels, 'values:', values);
  categoryChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: colors.slice(0, labels.length),
        borderColor: '#1f1f1f'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { position: 'bottom' },
        tooltip: {
          callbacks: {
            label: function(context) {
              return formatearMoneda(context.raw || context.parsed || 0);
            }
          }
        }
      }
    }
  });
  console.log('Gráfico de categoría creado exitosamente');
}

// Renderizar gráfico de historial
async function renderHistoryChart() {
  console.log('renderHistoryChart iniciando...');
  const data = await fetchHistoryData();
  console.log('data recibido en renderHistoryChart:', data);
  const ctx = document.getElementById('historyChart');
  console.log('ctx encontrado:', !!ctx);
  
  if (!ctx || !data || data.length === 0) {
    console.warn('No hay datos o elemento no encontrado:', { ctx: !!ctx, data: data?.length });
    return;
  }

  if (historyChartInstance) {
    historyChartInstance.destroy();
  }

  const labels = data.map(d => d.mes);
  const ingresos = data.map(d => d.ingresos || 0);
  const egresos = data.map(d => d.egresos || 0);

  console.log('Creando gráfico de historial con labels:', labels);
  historyChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Ingresos',
          data: ingresos,
          borderColor: '#03dac6',
          backgroundColor: 'rgba(3, 218, 198, 0.1)',
          tension: 0.3,
          fill: true
        },
        {
          label: 'Egresos',
          data: egresos,
          borderColor: '#cf6679',
          backgroundColor: 'rgba(207, 102, 121, 0.1)',
          tension: 0.3,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { position: 'bottom' },
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.dataset.label + ': ' + formatearMoneda(context.raw || context.parsed.y || 0);
            }
          }
        }
      },
      scales: {
        y: { 
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return formatearMoneda(value);
            }
          }
        }
      }
    }
  });
  console.log('Gráfico de historial creado exitosamente');
}

// Renderizar todos los gráficos
async function renderAllCharts() {
  console.log('renderAllCharts iniciando...');
  await renderChart();
  await renderCategoryChart();
  await renderHistoryChart();
  console.log('Todos los gráficos renderizados');
}

// Función global para recargar gráficos cuidadosamente
async function reloadCharts() {
  console.log('reloadCharts llamada - recargando todos los gráficos');
  try {
    await renderAllCharts();
    console.log('Gráficos recargados exitosamente');
  } catch (error) {
    console.error('Error al recargar gráficos:', error);
  }
}

// Hacer la función global accesible desde otros scripts
window.reloadCharts = reloadCharts;

// Inicializar gráficos
console.log('Iniciando aplicación de gráficos');
renderAllCharts();

