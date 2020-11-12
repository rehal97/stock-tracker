import React, { useEffect, useMemo, useRef, useState } from 'react';
import Chart from 'chart.js';

import { getStock, getDailyData, getIntradayData, symbolInfo } from '../../alpha-stocks';
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

const getClosingPrice = (data) => {
    let dailyData = {};
    for (let date in data) {
        dailyData[date] = parseFloat(data[date].['4. close']);
    }
    return dailyData;
}

const SymbolInfo = (props) => {
    const chartRef = useRef();

    const [symbol, setSymbol] = useState({});
    const [quoteData, setQuoteData] = useState({});
    const [symbolPriceData, setSymbolPriceData] = useState({});
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
            const dailyData = getClosingPrice(res);
            setSymbolPriceData(dailyData);
            console.log(dailyData)
        })

        // getIntradayData(props.location.symbol).then(res => {
        //     const intradayData = getClosingPrice(res);
        //     setSymbolPriceData(intradayData)
        //     console.log(intradayData)
            
        // })

    }, [])

    useEffect(() => {
        if (chartRef.current) {
            const myChartRef = chartRef.current.getContext("2d");

            let labels = []
            let prices = []

            for(let key in graphData) {
                labels.push(key);
                prices.push(graphData[key]);
            }
            
            labels = labels.reverse()
            prices = prices.reverse()


            new Chart(myChartRef, {
                type: 'line',
                data: {
                  labels: labels,
                  datasets: [{ 
                      data: prices,
                  }]
                },
                options: {
                  elements: {
                    // point:{
                    //     radius: 0
                    // },
                    line: {
                        tension: 0
                    }
                  },
                  title: {
                    display: true,
                    text: 'Prices over the last 5 days'
                  },
                  legend: {
                    display: false
                 },
                 scales:{
                    xAxes: [{
                        display: true,
                        ticks: {
                            maxTicksLimit: 5
                        },
                        type: 'time',
                        time: {
                            unit: 'day'
                        }
                    }]
                }
                }
              });            
        }

    }, [graphData])

    useEffect(() => {
        getLastFiveDays(symbolPriceData);
    }, [symbolPriceData])

    const getLastFiveDays = (data) => {
        const fiveDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        let lastFiveDays = {};

        let limit = 0;
        for (let key in data) {   
            console.log(key.toString());    
            let date = new Date(key.toString()+'T00:00:00');
            console.log(date.toString());
            lastFiveDays[date] = data[key];
            limit++;
            if(limit > 4){
                break;
            }
        }
        setGraphData(lastFiveDays)
        console.log(lastFiveDays)
    }
    
    const getLastMonth = (data) => {
        let limit = 0;
        let lastMonth = [];

        const limitDate = new Date();
        limitDate.setDate(limitDate.getDate() - 30);

        for (let key in data) {    
            lastMonth[key] = data[key];
            limit++;
            if(key > limit){
                break;
            }
        }
        setGraphData(lastMonth);
    }

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

                    <h5>Chart</h5>
                    <canvas id="myChart" ref={chartRef} width="400" height="400"></canvas>
                    
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