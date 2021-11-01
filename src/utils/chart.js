import { Chart, registerables } from "chart.js";
import bytes from "bytes";

Chart.register(...registerables);

export function getInitialChartConfig() {
  return {
    type: "line",
    data: {
      labels: [
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
      ],
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

export function createChartView(ctx, config) {
  return new Chart(ctx, config);
}

export function updateChartView(chart, labels, datasets) {
  chart.data.labels = labels;
  chart.data.datasets = datasets;
  chart.update();
}
