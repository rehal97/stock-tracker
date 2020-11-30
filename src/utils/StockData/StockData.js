import {
  getDailyData,
  getIntradayData,
  getStock,
  symbolInfo,
} from "../../alpha-stocks";

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

export const mapQuoteData = (data) => {
  let quoteData = {};
  for (let key in QuoteMap) {
    quoteData[QuoteMap[key]] = data[key];
  }
  return quoteData;
};

export const getClosingPrice = (data) => {
  let dailyData = {};
  for (let date in data) {
    dailyData[date] = parseFloat(data[date]["4. close"]);
  }
  return dailyData;
};

export const getInitialStockData = async (symbol) => {
  let symbolInfoData;
  let quoteData;
  let symbolPriceData;

  await symbolInfo(symbol).then((res) => {
    symbolInfoData = res;
  });

  await getStock(symbol).then((res) => {
    const data = mapQuoteData(res);
    quoteData = data;
  });

  await getIntradayData(symbol).then((res) => {
    const intradayData = getClosingPrice(res);
    symbolPriceData = intradayData;
  });

  return {
    symbolInfo: symbolInfoData,
    quoteData: quoteData,
    symbolPriceData: symbolPriceData,
  };
};

export const getLastDay = (data) => {
  let lastDay = {};

  let limit = new Date();
  limit.setHours(0, 0, 0);

  // check if market closed for holiday during weekdays
  if (limit.getDay() >= 1 && limit.getDay() <= 5) {
    limit.setTime(limit.getTime() - 2 * 24 * 60 * 60 * 1000);
  } else {
    limit.setTime(limit.getTime() - 1 * 24 * 60 * 60 * 1000);
  }

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

  return {
    timeframe: "intraday",
    data: lastDay,
  };
};

export const getLastFiveDays = (data) => {
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

  return {
    timeframe: "daily",
    data: lastFiveDays,
  };
};

export const getLastMonth = (data) => {
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

  return {
    timeframe: "monthly",
    data: lastMonth,
  };
};

export const getLastSixMonths = async (symbol) => {
  let dailyData = await getDailyData(symbol);
  dailyData = getClosingPrice(dailyData);

  let lastSixMonths = [];

  let limit = new Date();
  limit.setHours(0, 0, 0);
  limit.setTime(limit.getTime() - 178 * 24 * 60 * 60 * 1000);

  for (let key in dailyData) {
    lastSixMonths[key] = dailyData[key];
    if (new Date(key) < limit) {
      break;
    }
  }

  return {
    timeframe: "sixmonths",
    data: lastSixMonths,
  };
};

export const getYearToDay = async (symbol) => {
  let dailyData = await getDailyData(symbol);
  dailyData = getClosingPrice(dailyData);

  let yearToDay = [];

  let limit = new Date();
  limit.setHours(0, 0, 0);
  limit.setTime(limit.getTime() - 365 * 24 * 60 * 60 * 1000);

  for (let key in dailyData) {
    yearToDay[key] = dailyData[key];
    if (new Date(key) < limit) {
      break;
    }
  }

  return {
    timeframe: "yeartoday",
    data: yearToDay,
  };
};
