import React, { useState, useEffect, useMemo } from 'react';

/**
 * props:
 * - id
 * - quantity
 * - isQuote
 * - text
 * - symbol
 * - allowQuote
 * - onChange
 */
function QuantityInput(props) {

    const [isQuote, setIsQuote] = useState(false);

    useEffect(() => {
        setIsQuote(props.isQuote === 'true' || props.isQuote === true);
    }, [props.isQuote])

    function onCalcClick(event) {
        props.onChange({ target: { id: "isQuote", value: !isQuote } });
    }

    function getPlaceholder() {
        if(!props.symbol) return "";
        return isQuote ? props.symbol.minNotional : props.symbol.minLotSize;
    }

    const quantityInput = useMemo(() => (
        <div className="form-group">
            <label htmlFor={props.id}>{props.text}</label>
            <div className="input-group">
                {
                    props.allowQuote
                        ? <button type="button" className="btn btn-secondary d-inline-flex align-items-center" onClick={onCalcClick}>
                            {isQuote ? props.symbol.quote : props.symbol.base}
                        </button>
                        : <></>
                }
                <input id={props.id} type="number" value={props.quantity} className="form-control" placeholder={getPlaceholder()} onChange={props.onChange} />
            </div>
        </div>
    ), [props.quantity, props.isQuote, props.allowQuote, props.symbol, isQuote]);

    return quantityInput;
}

export default QuantityInput;
