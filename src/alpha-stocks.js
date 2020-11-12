import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://www.alphavantage.co/query'
});

export const getStock = async (symbol) => {
    const func = 'GLOBAL_QUOTE';
    const apikey = process.env.REACT_APP_ALPHA_KEY;
    const queryParams = '?function=' + func + '&symbol=' + symbol + '&apikey=' + apikey;

    const res = await instance.get(queryParams)
    return res.data['Global Quote'];
}

export const getDailyData = async (symbol) => {
    const func = 'TIME_SERIES_DAILY_ADJUSTED';
    const outputsize = 'compact';
    const apikey = process.env.REACT_APP_ALPHA_KEY;
    const queryParams = '?function=' + func + '&symbol=' + symbol + '&outputsize=' + outputsize + '&apikey=' + apikey;

    const res = await instance.get(queryParams)
    return res.data['Time Series (Daily)'];
}

export const getIntradayData = async (symbol) => {
    const func = 'TIME_SERIES_INTRADAY';
    const interval = '5min'
    const outputsize = 'full';
    const apikey = process.env.REACT_APP_ALPHA_KEY;
    const queryParams = '?function=' + func + '&symbol=' + symbol + '&interval=' + interval + '&outputsize=' + outputsize + '&apikey=' + apikey;

    const res = await instance.get(queryParams)
    return res.data['Time Series (5min)'];
}

export const symbolSearch = async (keywords) => {
    const func = 'SYMBOL_SEARCH';
    const apikey = process.env.REACT_APP_ALPHA_KEY;
    const queryParams = '?function=' + func + '&keywords=' + keywords + '&apikey=' + apikey;
    
    const res = await instance.get(queryParams)
    return res.data
};

export const symbolInfo = async (symbol) => {
    const func = 'OVERVIEW';
    const apikey = process.env.REACT_APP_ALPHA_KEY;
    const queryParams = '?function=' + func + '&symbol=' + symbol + '&apikey=' + apikey;

    const res = await instance.get(queryParams);
    return res.data;
}