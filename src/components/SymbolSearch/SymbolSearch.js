import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import ListGroup from "react-bootstrap/ListGroup";

import { symbolSearch } from "../../alpha-stocks";
import Aux from "../../hoc/Aux/Aux";

const SymbolSearch = (props) => {
  const [inputSymbol, setInputSymbol] = useState("");
  const [searchResults, setSearchResults] = useState({});

  const inputRef = useRef();

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (inputSymbol === inputRef.current.value) {
        symbolSearch(inputSymbol).then((res) => {
          if (res && !res["Error Message"]) {
            setSearchResults(res);
          }
        });
      }
    }, 900);
    return () => {
      clearTimeout(timer);
    };
  }, [inputSymbol, inputRef]);

  const redirectToSymbolPage = useCallback(
    (symbol) => {
      props.history.push({
        pathname: "/symbol/" + symbol,
        symbol: symbol,
      });
    },
    [props.history]
  );

  const renderSearchResults = useMemo(() => {
    const bestMatches = searchResults["bestMatches"];
    if (bestMatches !== undefined) {
      return (
        <ListGroup>
          {bestMatches &&
            bestMatches.map((result) => {
              let symbol = result["1. symbol"];
              let name = result["2. name"];
              return (
                <ListGroup.Item
                  key={symbol}
                  action
                  onClick={() => redirectToSymbolPage(symbol)}
                >
                  {symbol} - {name}
                </ListGroup.Item>
              );
            })}
        </ListGroup>
      );
    } else {
      return null;
    }
  }, [searchResults, redirectToSymbolPage]);

  return (
    <Aux>
      <InputGroup className="mt-3">
        <FormControl
          placeholder="Search Symbol"
          aria-label="symbol"
          ref={inputRef}
          onChange={(event) => setInputSymbol(event.target.value)}
        />
      </InputGroup>
      {inputSymbol !== "" && <h4>Searching for {inputSymbol.toUpperCase()}</h4>}
      <div>{renderSearchResults}</div>
    </Aux>
  );
};

export default SymbolSearch;
