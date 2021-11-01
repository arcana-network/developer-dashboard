import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const monthLabels = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function getInitialUsageChartConfig() {
  return {
    type: "line",
    data: {
      labels: monthLabels,
      datasets: [
        {
          label: "Storage used in MB",
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          borderColor: "white",
          borderWidth: 4,
          lineTension: 0.2,
        },
      ],
    },
    options: {
      animations: {
        tension: {
          duration: 1000,
          easing: "linear",
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
            callback: function (label, index, labels) {
              if (label === 0) {
                return "";
              }
              return label + " MB";
            },
          },
          // stepValue: 1024,
          // max: 5120,
          grid: {
            color: "#373737",
            borderDash: [10, 10],
          },
          title: {
            font: {
              family: "'Montserrat', sans-serif",
              size: 20,
              weight: 600,
            },
          },
          position: "right",
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
          // callbacks: {
          //   label: function (context) {
          //     const label = context.dataset.label || "";

          //     if (label) {
          //       label += ": ";
          //     }
          //     if (context.parsed.y !== null) {
          //       label += new Intl.NumberFormat("en-US", {
          //         style: "currency",
          //         currency: "USD",
          //       }).format(context.parsed.y);
          //     }
          //     return label;
          //   },
          // },
        },
      },
    },
  };
}

export function getInitialUsersChartConfig() {
  return {
    type: "line",
    data: {
      labels: monthLabels,
      datasets: [
        {
          label: "No of users",
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          borderColor: "white",
          borderWidth: 4,
          lineTension: 0.4,
        },
      ],
    },
    options: {
      animations: {
        tension: {
          duration: 1000,
          easing: "linear",
          from: 0.1,
          to: 0.2,
          loop: false,
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: "#373737",
            borderDash: [15, 15],
          },
          ticks: {
            callback: function (label, index, labels) {
              if (label === 0) {
                return "";
              }
              return label;
            },
          },
          title: {
            font: {
              family: "'Montserrat', sans-serif",
              size: 20,
              weight: 600,
            },
          },
          position: "right",
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
  };
}

export function createChartView(ctx, config) {
  return new Chart(ctx, config);
}

export function updateChartView(chart, labels, datasets) {
  chart.data.labels = labels;
  chart.data.datasets = datasets;
  chart.update();
}
