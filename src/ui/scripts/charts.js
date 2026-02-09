const API_URL = 'http://localhost:3000/api/transacciones';

let balanceChartInstance = null;
let categoryChartInstance = null;
let historyChartInstance = null;

// Obtener balance del mes actual
async function fetchBalance() {
  const today = new Date();
  const mes = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  try {
    const res = await fetch(`${API_URL}/${mes}/balance`);
    return await res.json();
  } catch (error) {
    console.error('Error al obtener balance:', error);
    return { ingresos: 0, egresos: 0, balance: 0 };
  }
}

// Obtener gastos por categoría
async function fetchCategoryData() {
  const today = new Date();
  const mes = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  try {
    const res = await fetch(`${API_URL}/${mes}/gastos-por-categoria`);
    return await res.json();
  } catch (error) {
    console.error('Error al obtener gastos por categoría:', error);
    return [];
  }
}

// Obtener balance histórico
async function fetchHistoryData() {
  try {
    const res = await fetch(`${API_URL}/balance/historial`);
    return await res.json();
  } catch (error) {
    console.error('Error al obtener historial:', error);
    return [];
  }
}

// Renderizar gráfico de balance mensual
async function renderChart() {
  const balance = await fetchBalance();
  const ctx = document.getElementById('balanceChart');
  
  if (!ctx) return;

  if (balanceChartInstance) {
    balanceChartInstance.destroy();
  }

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
        title: { display: false }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

// Renderizar gráfico de gastos por categoría
async function renderCategoryChart() {
  const data = await fetchCategoryData();
  const ctx = document.getElementById('categoryChart');
  
  if (!ctx || !data || data.length === 0) return;

  if (categoryChartInstance) {
    categoryChartInstance.destroy();
  }

  const labels = data.map(d => d.categoria || 'Sin categoría').slice(0, 8);
  const values = data.map(d => d.total || 0).slice(0, 8);

  const colors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
    '#FF9F40', '#FF6384', '#C9CBCF'
  ];

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
        legend: { position: 'bottom' }
      }
    }
  });
}

// Renderizar gráfico de historial
async function renderHistoryChart() {
  const data = await fetchHistoryData();
  const ctx = document.getElementById('historyChart');
  
  if (!ctx || !data || data.length === 0) return;

  if (historyChartInstance) {
    historyChartInstance.destroy();
  }

  const labels = data.map(d => d.mes);
  const ingresos = data.map(d => d.ingresos || 0);
  const egresos = data.map(d => d.egresos || 0);

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
        legend: { position: 'bottom' }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

// Renderizar todos los gráficos
async function renderAllCharts() {
  await renderChart();
  await renderCategoryChart();
  await renderHistoryChart();
}

// Inicializar gráficos
renderAllCharts();

