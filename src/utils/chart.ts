import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

const monthLabels = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

function getInitialUsageChartConfig() {
  return {
    type: 'line',
    data: {
      labels: monthLabels,
      datasets: [
        {
          label: 'Storage used in MB',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          borderColor: 'white',
          borderWidth: 4,
          lineTension: 0.2,
        },
      ],
    },
    options: {
      animations: {
        tension: {
          duration: 1000,
          easing: 'linear',
          from: 0.1,
          to: 0.2,
          loop: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          steps: 5,
          ticks: {
            callback: function (label: any) {
              if (label === 0) {
                return ''
              }
              return label + ' MB'
            },
          },
          grid: {
            color: '#373737',
            borderDash: [10, 10],
          },
          title: {
            font: {
              family: "'Montserrat', sans-serif",
              size: 20,
              weight: 600,
            },
          },
          position: 'right',
        },
        x: {
          grid: {
            display: false,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
          labels: {
            font: {
              family: "'Montserrat', sans-serif",
              size: 20,
              weight: 400,
            },
          },
        },
        tooltip: {
          enabled: true,
        },
      },
    },
  }
}

function getInitialUsersChartConfig() {
  return {
    type: 'line',
    data: {
      labels: monthLabels,
      datasets: [
        {
          label: 'No of users',
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          borderColor: 'white',
          borderWidth: 4,
          lineTension: 0.4,
        },
      ],
    },
    options: {
      animations: {
        tension: {
          duration: 1000,
          easing: 'linear',
          from: 0.1,
          to: 0.2,
          loop: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: '#373737',
            borderDash: [15, 15],
          },
          ticks: {
            precision: 0,
            callback: function (label: any) {
              if (label === 0) {
                return ''
              }
              return label
            },
          },
          title: {
            font: {
              family: "'Montserrat', sans-serif",
              size: 20,
              weight: 600,
            },
          },
          position: 'right',
        },
        x: {
          grid: {
            display: false,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
          labels: {
            font: {
              family: "'Montserrat', sans-serif",
              size: 20,
              weight: 400,
            },
          },
        },
        tooltip: {},
      },
    },
  }
}

function createChartView(ctx, config) {
  return new Chart(ctx, config)
}

function updateChartView(chart: Chart, labels: string[], datasets: any[]) {
  if (chart) {
    chart.data.labels = labels
    chart.data.datasets = datasets
    chart.update()
  }
}

const chartUtils = {
  getInitialUsageChartConfig,
  getInitialUsersChartConfig,
  createChartView,
  updateChartView,
}

export default chartUtils
