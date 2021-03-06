import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import Axios from "axios";

import {
  createSymbolInfoChart,
  getTimeframeUnit,
} from "../../utils/Chart/Chart";

import {
  getLastDay,
  getLastFiveDays,
  getLastMonth,
  getLastSixMonths,
  getYearToDay,
  getInitialStockData,
} from "../../utils/StockData/StockData";

import Aux from "../../hoc/Aux/Aux";
import classes from "./SymbolInfo.module.css";

import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const initialRangeState = {
  oneDay: { active: false, label: "1D" },
  fiveDays: { active: false, label: "5D" },
  oneMonth: { active: false, label: "1M" },
  sixMonths: { active: false, label: "6M" },
  yearToDay: { active: false, label: "YTD" },
};

const instance = Axios.create({
  baseURL: "https://radiant-bastion-21109.herokuapp.com/",
});

const SymbolInfo = (props) => {
  const chartRef = useRef();

  const [chart, setChart] = useState();
  const [symbol, setSymbol] = useState({});
  const [quoteData, setQuoteData] = useState({});
  const [symbolPriceData, setSymbolPriceData] = useState({});
  const [graphData, setGraphData] = useState({});
  const [selectedRange, setSelectedRange] = useState({
    ...initialRangeState,
    oneDay: { active: true, label: "1D" },
  });
  const [portfolios, setPortfolios] = useState({});

  useEffect(() => {
    const fetchInitialData = async () => {
      const data = await getInitialStockData(props.location.symbol);
      setSymbol(data.symbolInfo);
      setQuoteData(data.quoteData);
      setSymbolPriceData(data.symbolPriceData);
    };

    fetchInitialData();
  }, [props.location.symbol]);

  useEffect(() => {
    // set initial 1 day graph data
    setGraphData(getLastDay(symbolPriceData));
  }, [symbolPriceData]);

  useEffect(() => {
    if (chartRef.current) {
      console.log("ghgh");
      console.log(graphData);
      const myChartRef = chartRef.current.getContext("2d");
      let myChart;

      let labels = [];
      let prices = [];

      for (let key in graphData.data) {
        labels.push(key);
        prices.push(graphData.data[key]);
      }

      const res = getTimeframeUnit(graphData.timeframe);

      labels = labels.reverse();
      prices = prices.reverse();

      if (chart) {
        chart.destroy();
      }

      myChart = createSymbolInfoChart(
        myChartRef,
        labels,
        prices,
        res.timeframe,
        res.unit
      );

      setChart(myChart);
    }
  }, [graphData]);

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
    async (range) => {
      toggleRangeSelectors(range);
      switch (range) {
        case "oneDay":
          setGraphData(getLastDay(symbolPriceData));
          break;
        case "fiveDays":
          setGraphData(getLastFiveDays(symbolPriceData));
          break;
        case "oneMonth":
          setGraphData(getLastMonth(symbolPriceData));
          break;
        case "sixMonths":
          setGraphData(await getLastSixMonths(props.location.symbol));
          break;
        case "yearToDay":
          setGraphData(await getYearToDay(props.location.symbol));
          break;
        default:
          return;
      }
    },
    [props.location.symbol, symbolPriceData, toggleRangeSelectors]
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

  useEffect(() => {
    instance.get("/api/portfolios").then((res) => {
      setPortfolios(res.data);
    });
  }, []);

  const addToPortfolio = (portfolioId) => {
    instance
      .post("/api/portfolios/addHolding", {
        params: {
          id: portfolioId,
          symbol: symbol.Symbol,
        },
      })
      .then((res) => {
        console.log("added holding to portfolio");
      })
      .catch((err) => {
        console.log("Could not fetch portfolio.");
      });
  };

  const renderPortfolioDropdown = () => {
    if (portfolios) {
      return (
        <Dropdown>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            Add to Portfolio
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {portfolios.map((portfolio) => {
              return (
                <Dropdown.Item
                  key={portfolio._id}
                  onClick={() => addToPortfolio(portfolio._id)}
                >
                  {portfolio.name}
                </Dropdown.Item>
              );
            })}
          </Dropdown.Menu>
        </Dropdown>
      );
    }
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
                {renderPortfolioDropdown()}
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
