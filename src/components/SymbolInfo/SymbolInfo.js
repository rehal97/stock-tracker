import React, { useEffect, useMemo, useState } from 'react';

import { getStock, getDailyData, symbolInfo } from '../../alpha-stocks';
import Aux from '../../hoc/Aux/Aux';

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
    "10. change percent": "changePercentage"
}

const mapQuoteData = (data) => {
    let quoteData = {}
    for (let key in QuoteMap) {        
        quoteData[QuoteMap[key]] = data[key];
    }
    return quoteData;
}

const dailyClosingPrice = (data) => {
    let dailyData = {};
    for (let date in data) {
        dailyData[date] = parseFloat(data[date].['4. close']);
    }
    return dailyData;
}

const SymbolInfo = (props) => {

    const [symbol, setSymbol] = useState({});
    const [quoteData, setQuoteData] = useState({});
    const [graphData, setGraphData] = useState({});

    useEffect(() => {
        symbolInfo(props.location.symbol).then(res => {
            setSymbol(res);
        });

        getStock(props.location.symbol).then(res => {
            const data = mapQuoteData(res);
            setQuoteData(data);
        })

        getDailyData(props.location.symbol).then(res => {
            const dailyData = dailyClosingPrice(res);
            console.log(dailyData);
            setGraphData(dailyData);
        })
    }, [])

    const renderSymbolInfo = useMemo(() => {
        if(symbol.Name){
            return (
                <Aux>
                    <h2>{symbol.Name} ({symbol.Symbol})</h2>
                    <h4>{parseFloat(quoteData.price)} {parseFloat(quoteData.change).toFixed(2)} ({parseFloat(quoteData.changePercentage).toFixed(2)}%)</h4>

                    <h5>Summary:</h5>
                    <p>Previous Close: {parseFloat(quoteData.prevClose).toFixed(2)}</p>
                    <p>Open: {parseFloat(quoteData.open).toFixed(2)}</p>
                    <p>Days Range: {parseFloat(quoteData.low)}-{parseFloat(quoteData.high)}</p>
                    <p>Volume: {parseFloat(quoteData.volume)}</p>

                    <h5>Description:</h5>
                    <p>{symbol.Description}</p>
                </Aux>
            )
        } 
        return null
    },[symbol, quoteData]);

    return (
        <Aux>
            {renderSymbolInfo}
        </Aux>
    )
}

export default SymbolInfo;