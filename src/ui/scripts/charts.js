const ctx = document.getElementById('balanceChart').getContext('2d');

async function fetchBalance() {
  const today = new Date();
  const mes = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  const res = await fetch(`${API_URL}/${mes}/balance`);
  const data = await res.json();
  return data;
}

async function renderChart() {
  const balance = await fetchBalance();

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Ingresos', 'Egresos'],
      datasets: [{
        label: 'Balance mensual',
        data: [balance.ingresos, balance.egresos],
        backgroundColor: ['#03dac6', '#cf6679']
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: true, text: 'Ingresos vs Egresos' }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

renderChart();
