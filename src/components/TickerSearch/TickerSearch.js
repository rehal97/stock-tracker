import React, { useEffect, useMemo, useRef, useState } from 'react';
// import { Redirect } from 'react-router-dom';

import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import ListGroup from 'react-bootstrap/ListGroup';


import {symbolSearch} from '../../alpha-stocks';
import Aux from '../../hoc/Aux/Aux';

const TickerSearch = (props) => {
    const [inputTicker, setInputTicker] = useState('');
    const [searchResults, setSearchResults] = useState({});

    const inputRef = useRef();

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (inputTicker === inputRef.current.value) {
                symbolSearch(inputTicker).then( res => {
                    if (res && !res['Error Message']) {
                        setSearchResults(res);
                        // console.log(res)
                    }
                })
            }
        }, 900);
        return () => {
          clearTimeout(timer);
        }
    }, [inputTicker, inputRef]);

    const redirectToTickerPage = (symbol) => {
        console.log('path: ' + '/ticker/' + symbol);
        props.history.push({
            pathname: '/ticker/' + symbol,
            ticker: symbol
        });
    }

    const renderSearchResults = useMemo (() => {
        const bestMatches = searchResults.['bestMatches'];
        if (bestMatches !== undefined) {
            return(
                <ListGroup>
                {bestMatches && bestMatches.map(result => {
                    let symbol = result.['1. symbol'];
                    return (
                        <ListGroup.Item key={symbol} action onClick={() => redirectToTickerPage(symbol)}>
                            {symbol}
                        </ListGroup.Item>
                    )
                })}   
                </ListGroup>
            )
        } else {
            return null
        }
    }, [searchResults]);

    return (
        <Aux>
            <h1>Stock Search</h1>

            <InputGroup className="mb-3">
                <FormControl
                placeholder="Search Ticker"
                aria-label="ticker"
                ref={inputRef}
                onChange={event => setInputTicker(event.target.value)}
                />
            </InputGroup>
            {inputTicker !== '' && <h4>Searching for {inputTicker.toUpperCase()}</h4>}
            <div>
                {renderSearchResults}
            </div>
        </Aux>
    )
}

export default TickerSearch;