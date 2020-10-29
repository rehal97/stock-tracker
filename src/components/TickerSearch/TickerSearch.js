import React, { useEffect, useMemo, useRef, useState } from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import ListGroup from 'react-bootstrap/ListGroup';


import {getStock, symbolSearch} from '../../alpha-stocks';

const TickerSearch = () => {
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

    const renderSearchResults = useMemo (() => {
        console.log(searchResults)
        if (searchResults.['bestMatches'] !== undefined) {
            return(
                <ListGroup>
                {searchResults.['bestMatches'] && searchResults.['bestMatches'].map(result => (
                    <ListGroup.Item key={result.['1. symbol']}>
                        {result.['1. symbol']}
                    </ListGroup.Item>
                ))}   
            </ListGroup>
            )
        } else {
            return null
        }
    }, [searchResults]);

    return (
        <div>
            <InputGroup className="mb-3">
                <FormControl
                placeholder="Search Ticker"
                aria-label="ticker"
                ref={inputRef}
                onChange={event => setInputTicker(event.target.value)}
                />
            </InputGroup>
            <h4>Searching for {inputTicker.toUpperCase()}</h4>
            <div>
                {renderSearchResults}

            </div>
        </div>
    )
}

export default TickerSearch;