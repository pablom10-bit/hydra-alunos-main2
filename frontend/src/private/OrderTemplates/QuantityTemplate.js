import React, { useEffect, useState } from 'react';

/**
 * props:
 * - id
 * - text
 * - quantity
 * - multiplier
 * - isFuture
 * - onChange
 */
function QuantityTemplate(props) {

    const [quantityTemplate, setQuantityTemplate] = useState({ quantity: '', multiplier: '' });
    const [mode, setMode] = useState("1");
    const [isFuture, setIsFuture] = useState(!!props.isFuture);

    useEffect(() => {
        setQuantityTemplate({ quantity: props.quantity, multiplier: props.multiplier });
        setMode(!props.quantity || /^[0-9]/.test(props.quantity) ? "1" : "2");
    }, [props.quantity, props.multiplier])

    useEffect(() => {
        setIsFuture(!!props.isFuture);
    }, [props.isFuture])

    function onModeChange(event) {
        props.onChange({ target: { id: props.id, value: "" } });
        setMode(event.target.value);
    }

    return (
        <div className="form-group">
            <label htmlFor={props.id}>{props.text} <span data-bs-toggle="tooltip" data-bs-placement="top" title="Max. Wallet trades the maximum you have. Min. Notional trades the minimum allowed. Multiplying by 1 = 100%." className="badge bg-warning py-1">?</span></label>
            <div className="input-group">
                <select className='form-select' value={mode} onChange={onModeChange}>
                    <option value="1">By Value</option>
                    <option value="2">By Expression</option>
                </select>
                {
                    mode === "1"
                        ? (
                            <input id={props.id} type="text" className="form-control" onChange={props.onChange} placeholder="0" value={quantityTemplate.quantity || '0'} />
                        )
                        : (
                            <select className='form-select' id={props.id} onChange={props.onChange} value={quantityTemplate.quantity || ``}>
                                <option>Select...</option>
                                <option>{isFuture ? "F" : ""}LAST_ORDER_QTY</option>
                                <option>MIN_NOTIONAL</option>
                                {
                                    isFuture
                                        ? (
                                            <option>POSITION_AMT</option>
                                        )
                                        : (
                                            <React.Fragment>
                                                <option>MAX_WALLET</option>
                                                <option>QUOTE_QTY</option>
                                            </React.Fragment>
                                        )
                                }
                            </select>
                        )
                }
                <span className="input-group-text bg-secondary">
                    {quantityTemplate.quantity !== 'QUOTE_QTY' ? "X" : "="}
                </span>
                <input id={props.id + "Multiplier"} type="number" className="form-control" onChange={props.onChange} placeholder="1" value={quantityTemplate.multiplier || ''} />
            </div>
        </div>
    )
}

export default QuantityTemplate;