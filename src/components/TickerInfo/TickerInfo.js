import React, { useEffect, useMemo, useState } from 'react';

import { symbolInfo } from '../../alpha-stocks';

const TickerInfo = (props) => {

    const [symbol, setSymbol] = useState({});

    useEffect(() => {
        symbolInfo(props.location.ticker).then(res => {
            setSymbol(res);
        });

    }, [])

    const renderSymbolInfo = useMemo(() => {
        console.log(symbol)
        return (
            <div>
            <p>Description</p>
            <p>{symbol ? symbol.Description : null}</p>
            </div>
        )
    },[symbol]);

    return (
        <div>
            <h1>Ticker: {props.location.ticker}</h1>
            {renderSymbolInfo}
        </div>
    )
}

export default TickerInfo;