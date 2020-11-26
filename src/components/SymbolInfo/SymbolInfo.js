import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Chart from "chart.js";

import {
  getStock,
  getDailyData,
  getIntradayData,
  symbolInfo,
} from "../../alpha-stocks";
import Aux from "../../hoc/Aux/Aux";

import classes from "./SymbolInfo.module.css";

import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const QuoteMap = {
  "01. symbol": "symbol",
  "02. open": "open",
  "03. high": "high",
  "04. low": "low",
  "05. price": "price",
  "06. volume": "volume",
  "07. latest trading day": "ltd",
  "08. previous close": "prevClose",
  "09. change": "change",
  "10. change percent": "changePercentage",
};

const initialRangeState = {
  oneDay: { active: false, label: "1D" },
  fiveDays: { active: false, label: "5D" },
  oneMonth: { active: false, label: "1M" },
  sixMonths: { active: false, label: "6M" },
  yearToDay: { active: false, label: "YTD" },
};

const mapQuoteData = (data) => {
  let quoteData = {};
  for (let key in QuoteMap) {
    quoteData[QuoteMap[key]] = data[key];
  }
  return quoteData;
};

const getClosingPrice = (data) => {
  let dailyData = {};
  for (let date in data) {
    dailyData[date] = parseFloat(data[date]["4. close"]);
  }
  return dailyData;
};

const SymbolInfo = (props) => {
  const chartRef = useRef();

  const [symbol, setSymbol] = useState({});
  const [quoteData, setQuoteData] = useState({});
  const [symbolPriceData, setSymbolPriceData] = useState({});
  const [graphData, setGraphData] = useState({});
  const [selectedRange, setSelectedRange] = useState({
    ...initialRangeState,
    oneDay: { active: true, label: "1D" },
  });

  useEffect(() => {
    symbolInfo(props.location.symbol).then((res) => {
      setSymbol(res);
    });

    getStock(props.location.symbol).then((res) => {
      const data = mapQuoteData(res);
      setQuoteData(data);
    });

    getIntradayData(props.location.symbol).then((res) => {
      const intradayData = getClosingPrice(res);
      setSymbolPriceData(intradayData);
    });
  }, [props.location.symbol]);

  useEffect(() => {
    if (chartRef.current) {
      const myChartRef = chartRef.current.getContext("2d");

      let labels = [];
      let prices = [];

      for (let key in graphData.data) {
        labels.push(key);
        prices.push(graphData.data[key]);
      }

      let timeframe;
      let unit;
      if (graphData.timeframe === "intraday") {
        timeframe = 6;
        unit = "hour";
      } else if (graphData.timeframe === "daily") {
        timeframe = 4;
        unit = "day";
      } else if (graphData.timeframe === "monthly") {
        timeframe = 14;
        unit = "month";
      } else if (graphData.timeframe === "sixmonths") {
        timeframe = 6;
        unit = "month";
      } else if (graphData.timeframe === "yeartoday") {
        timeframe = 12;
        unit = "month";
      }

      labels = labels.reverse();
      prices = prices.reverse();

      new Chart(myChartRef, {
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
          title: {
            display: false,
            text: "Prices over the last 5 days",
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
                ticks: {
                  suggestedMin: Math.floor(Math.min(...prices)),
                  suggestedMax: Math.ceil(Math.max(...prices)),
                },
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
    }
  }, [graphData]);

  useEffect(() => {
    getLastDay(symbolPriceData);
  }, [symbolPriceData]);

  const getLastDay = (data) => {
    let lastDay = {};

    let limit = new Date();
    limit.setHours(0, 0, 0);
    limit.setTime(limit.getTime() - 1 * 24 * 60 * 60 * 1000);

    for (let key in data) {
      let date = new Date(key.toString());
      if (date < limit) {
        break;
      }

      // ignore after-market and pre-market data
      if (date.getHours() >= 6 && date.getHours() < 16) {
        lastDay[date] = data[key];
      }
    }

    setGraphData({
      timeframe: "intraday",
      data: lastDay,
    });
  };

  const getLastFiveDays = (data) => {
    let lastFiveDays = {};

    let limit = new Date();
    limit.setHours(0, 0, 0);
    limit.setTime(limit.getTime() - 7 * 24 * 60 * 60 * 1000);

    for (let key in data) {
      let date = new Date(key.toString());
      if (date < limit) {
        break;
      }

      // ignore after-market and pre-market data
      if (date.getHours() >= 6 && date.getHours() < 16) {
        lastFiveDays[date] = data[key];
      }
    }

    setGraphData({
      timeframe: "daily",
      data: lastFiveDays,
    });
  };

  const getLastMonth = (data) => {
    let lastMonth = [];

    let limit = new Date();
    limit.setHours(0, 0, 0);
    limit.setTime(limit.getTime() - 31 * 24 * 60 * 60 * 1000);

    for (let key in data) {
      lastMonth[key] = data[key];
      if (key >= limit) {
        break;
      }
    }

    setGraphData({
      timeframe: "monthly",
      data: lastMonth,
    });
  };

  const getLastSixMonths = useCallback(async () => {
    let dailyData = await getDailyData(props.location.symbol);
    dailyData = getClosingPrice(dailyData);

    let lastSixMonths = [];

    let limit = new Date();
    limit.setHours(0, 0, 0);
    limit.setTime(limit.getTime() - 178 * 24 * 60 * 60 * 1000);

    for (let key in dailyData) {
      lastSixMonths[key] = dailyData[key];
      if (key >= limit) {
        break;
      }
    }
    setGraphData({
      timeframe: "sixmonths",
      data: lastSixMonths,
    });
  }, [props.location.symbol]);

  const getYearToDay = useCallback(async () => {
    let dailyData = await getDailyData(props.location.symbol);
    dailyData = getClosingPrice(dailyData);

    let yearToDay = [];

    let limit = new Date();
    limit.setHours(0, 0, 0);
    limit.setTime(limit.getTime() - 365 * 24 * 60 * 60 * 1000);

    for (let key in dailyData) {
      yearToDay[key] = dailyData[key];
      if (key < limit) {
        break;
      }
    }
    setGraphData({
      timeframe: "yeartoday",
      data: yearToDay,
    });
  }, [props.location.symbol]);

  const toggleRangeSelectors = useCallback(
    (selected) => {
      let newRange = {
        ...initialRangeState,
        [selected]: {
          ...selectedRange[selected],
          active: true,
        },
      };
      setSelectedRange(newRange);
    },
    [selectedRange]
  );

  const updateChart = useCallback(
    (range) => {
      toggleRangeSelectors(range);
      switch (range) {
        case "oneDay":
          getLastDay(symbolPriceData);
          break;
        case "fiveDays":
          getLastFiveDays(symbolPriceData);
          break;
        case "oneMonth":
          getLastMonth(symbolPriceData);
          break;
        case "sixMonths":
          getLastSixMonths();
          break;
        case "yearToDay":
          getYearToDay();
          break;
        default:
          return;
      }
    },
    [getLastSixMonths, getYearToDay, symbolPriceData, toggleRangeSelectors]
  );

  const renderRangeSelectors = useMemo(() => {
    return (
      <ButtonGroup className={classes.RangeButtons}>
        {Object.keys(selectedRange).map((key, index) => {
          return (
            <Button
              className={selectedRange[key].active ? "active" : null}
              variant="secondary"
              onClick={updateChart.bind(this, key)}
              key={key}
            >
              {selectedRange[key].label}
            </Button>
          );
        })}
      </ButtonGroup>
    );
  }, [selectedRange, updateChart]);

  const getChangeStyle = (number) => {
    if (parseFloat(number) > 0) {
      return classes.PositiveChange;
    } else if (parseFloat(number) < 0) {
      return classes.NegativeChange;
    }
    return null;
  };

  const renderSymbolInfo = useMemo(() => {
    if (symbol.Name) {
      return (
        <Aux>
          <Container>
            <Row>
              <Col>
                <h2>
                  {symbol.Name} ({symbol.Symbol})
                </h2>
                <div>
                  <h4>
                    {parseFloat(quoteData.price).toFixed(2)}{" "}
                    <span className={getChangeStyle(quoteData.change)}>
                      {parseFloat(quoteData.change).toFixed(2)}{" "}
                    </span>
                    <span
                      className={getChangeStyle(quoteData.changePercentage)}
                    >
                      ({parseFloat(quoteData.changePercentage).toFixed(2)}%)
                    </span>
                  </h4>
                </div>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col>
                <h5>Summary:</h5>
                <p>
                  Previous Close: {parseFloat(quoteData.prevClose).toFixed(2)}
                </p>
                <p>Open: {parseFloat(quoteData.open).toFixed(2)}</p>
                <p>
                  Days Range: {parseFloat(quoteData.low)}-
                  {parseFloat(quoteData.high)}
                </p>
                <p>Volume: {parseFloat(quoteData.volume)}</p>
              </Col>

              <Col>
                <canvas
                  id="myChart"
                  ref={chartRef}
                  width="400"
                  height="300"
                ></canvas>
                {renderRangeSelectors}
              </Col>
            </Row>
            <Row className="mt-3">
              <Col>
                <h5>Description:</h5>
                <p>{symbol.Description}</p>
              </Col>
            </Row>
          </Container>
        </Aux>
      );
    }

    return null;
  }, [symbol, quoteData, renderRangeSelectors]);

  return <Aux>{renderSymbolInfo}</Aux>;
};

export default SymbolInfo;
