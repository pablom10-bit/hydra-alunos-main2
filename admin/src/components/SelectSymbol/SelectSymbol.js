import React, { useState, useEffect, useMemo } from 'react';
import { getSymbols } from '../../services/SymbolsService';
import Select from 'react-select';

/**
 * props:
 * - symbol
 * - disabled
 * - onChange
 */
function SelectSymbol(props) {

    const [symbols, setSymbols] = useState(["LOADING"]);
    const [isDisabled, setIsDisabled] = useState(false);
    const [value, setValue] = useState('');

    useEffect(() => {
        setValue({ label: props.symbol, value: props.symbol });
    }, [props.symbol])

    useEffect(() => {
        setIsDisabled(props.disabled);
    }, [props.disabled])

    useEffect(() => {
        getSymbols()
            .then(symbolObjects => {
                const symbolNames = symbolObjects.rows ? symbolObjects.rows.map(s => s.symbol) : symbolObjects.map(s => s.symbol);

                if (symbolNames.length){
                    setSymbols(symbolNames.map(s => {
                        return {
                            value: s, label: s
                        }
                    }));
                }
                else {
                    setSymbols(["NO SYMBOLS"]);
                    setIsDisabled(true);
                }
            })
            .catch(err => {
                console.error(err.response ? err.response.data : err.message);
                setSymbols(["ERROR"]);
                setIsDisabled(true);
            })
    }, [])

    function onSymbolChange(event) {
        props.onChange({ target: { id: 'symbol', value: event.value } });
    }

    const customStyles = {
        control: (provided) => ({
            ...provided,
            width: 220
        })
    }

    const selectSymbol = useMemo(() => {
        return (
            <Select
                value={value}
                isDisabled={isDisabled}
                styles={customStyles}
                onChange={onSymbolChange}
                options={symbols} />
        )
    }, [symbols, value, isDisabled])

    return (selectSymbol);
}

export default SelectSymbol;