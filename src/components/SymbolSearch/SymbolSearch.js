import React, { useEffect, useMemo, useRef, useState } from 'react';
// import { Redirect } from 'react-router-dom';

import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import ListGroup from 'react-bootstrap/ListGroup';


import {symbolSearch} from '../../alpha-stocks';
import Aux from '../../hoc/Aux/Aux';

const SymbolSearch = (props) => {
    const [inputSymbol, setInputSymbol] = useState('');
    const [searchResults, setSearchResults] = useState({});

    const inputRef = useRef();

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (inputSymbol === inputRef.current.value) {
                symbolSearch(inputSymbol).then( res => {
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
    }, [inputSymbol, inputRef]);

    const redirectToSymbolPage = (symbol) => {
        console.log('path: ' + '/symbol/' + symbol);
        props.history.push({
            pathname: '/symbol/' + symbol,
            symbol: symbol
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
                        <ListGroup.Item key={symbol} action onClick={() => redirectToSymbolPage(symbol)}>
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
                placeholder="Search Symbol"
                aria-label="symbol"
                ref={inputRef}
                onChange={event => setInputSymbol(event.target.value)}
                />
            </InputGroup>
            {inputSymbol !== '' && <h4>Searching for {inputSymbol.toUpperCase()}</h4>}
            <div>
                {renderSearchResults}
            </div>
        </Aux>
    )
}

export default SymbolSearch;