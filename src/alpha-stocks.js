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