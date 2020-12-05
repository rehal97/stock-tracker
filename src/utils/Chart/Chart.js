import Chart from "chart.js";

export const getTimeframeUnit = (timeframe) => {
  if (timeframe === "intraday") {
    return {
      timeframe: 6,
      unit: "hour",
    };
  } else if (timeframe === "daily") {
    return {
      timeframe: 4,
      unit: "day",
    };
  } else if (timeframe === "monthly") {
    return {
      timeframe: 14,
      unit: "month",
    };
  } else if (timeframe === "sixmonths") {
    return {
      timeframe: 6,
      unit: "month",
    };
  } else if (timeframe === "yeartoday") {
    return {
      timeframe: 12,
      unit: "month",
    };
  }
};

export const createSymbolInfoChart = (
  chartRef,
  labels,
  prices,
  timeframe,
  unit
) => {
  return new Chart(chartRef, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          data: prices,
          fill: false,
          borderColor: () => {
            if (prices[0] > prices[prices.length - 1]) return "red";
            return "green";
          },
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      elements: {
        point: {
          radius: 0,
        },
        line: {
          tension: 0,
        },
      },
      legend: {
        display: false,
      },
      scales: {
        xAxes: [
          {
            display: true,
            ticks: {
              maxTicksLimit: timeframe,
            },
            type: "time",
            time: {
              unit: unit,
            },
            distribution: "series",
          },
        ],
        yAxes: [
          {
            display: false,
          },
        ],
      },
      tooltips: {
        callbacks: {
          label: (tooltipItem) => {
            return "$ " + tooltipItem.yLabel.toFixed(2);
          },
          title: (tooltipItem) => {
            let titleDate = new Date(tooltipItem[0].label);

            let month = titleDate.getMonth() + 1;
            let date = titleDate.getDate();
            let hour = titleDate.getHours();
            let minute = titleDate.getMinutes();

            const titleString =
              month +
              "-" +
              date +
              " " +
              hour +
              ":" +
              (minute < 10 ? "0" : "") +
              minute;
            return titleString;
          },
        },
      },
    },
  });
};
