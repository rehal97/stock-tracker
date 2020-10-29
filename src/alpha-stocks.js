import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://www.alphavantage.co/query'
});

export const getStock = async (ticker) => {

    const func = 'TIME_SERIES_DAILY';
    const symbol = ticker;
    const outputsize = 'compact';
    const apikey = process.env.REACT_APP_ALPHA_KEY;

    const queryParams = '?function=' + func + '&symbol=' + symbol + '&outputsize=' + outputsize + '&apikey=' + apikey;
    
      
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    var today = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1).slice(0,10);

    // let stock = await instance.get(queryParams)
    instance.get(queryParams).then(res => {
        // console.log(res);
        if(!res.data.['Error Message']) {
            console.log(res.data['Time Series (Daily)'].[today]);
        }
    })
}

export const symbolSearch = async (keywords) => {

    const func = 'SYMBOL_SEARCH';
    const apikey = process.env.REACT_APP_ALPHA_KEY;

    const queryParams = '?function=' + func + '&keywords=' + keywords + '&apikey=' + apikey;
    

    // let stock = await instance.get(queryParams)
    const res = await instance.get(queryParams)
    return res.data

};