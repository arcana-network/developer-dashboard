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

const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const defaultData = {
  day: [0, 0, 0, 0, 0, 0, 0],
  month: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
}

function getInitialUsersChartConfig(
  labels = dayLabels,
  data = defaultData.day
) {
  return {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'No of active users',
          data,
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
  getInitialUsersChartConfig,
  createChartView,
  updateChartView,
  dayLabels,
  monthLabels,
}

export default chartUtils
