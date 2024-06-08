import React, { useEffect, useState } from 'react';
import { getMonitorsBySymbol } from '../../services/MonitorsService';

/**
 * props:
 * - id
 * - text
 * - symbol
 * - price
 * - isFuture
 * - multiplier
 * - onChange
 */
function PriceTemplate(props) {

    const [intervals, setIntervals] = useState([]);
    const [mode, setMode] = useState("1");
    const [isFuture, setIsFuture] = useState(!!props.isFuture);
    const [priceTemplate, setPriceTemplate] = useState({ price: '', multiplier: '' });

    useEffect(() => {
        setPriceTemplate({ price: props.price, multiplier: props.multiplier });
        setMode(!props.price || /^[0-9]/.test(props.price) ? "1" : "2");
    }, [props.price, props.multiplier])

    useEffect(() => {
        setIsFuture(!!props.isFuture);
    }, [props.isFuture])

    useEffect(() => {
        if (!props.symbol) return;
        getMonitorsBySymbol(props.symbol)
            .then(monitors => setIntervals(monitors.filter(m => m.type === 'CANDLES' && m.isActive && !m.isSystemMon).map(m => m.interval)))
            .catch(err => console.log(err.response ? err.response.data : err.message));
    }, [props.symbol])

    function onModeChange(event) {
        props.onChange({ target: { id: props.id, value: "" } });
        setMode(event.target.value);
    }

    return (
        <div className="form-group">
            <label htmlFor={props.id}>{props.text}</label>
            <div className="input-group">
                <select className='form-select' value={mode} onChange={onModeChange}>
                    <option value="1">By Value</option>
                    <option value="2">By Expression</option>
                </select>
                {
                    mode === "1"
                        ? (
                            <input id={props.id} type="text" className="form-control" onChange={props.onChange} placeholder="0" value={priceTemplate.price || '0'} />
                        )
                        : (
                            <select className='form-select' id={props.id} onChange={props.onChange} value={priceTemplate.price || ''}>
                                <option>Select...</option>
                                <option>BOOK_ASK</option>
                                <option>BOOK_BID</option>
                                {
                                    intervals.map(item => (
                                        <React.Fragment key={item}>
                                            <option>{"LAST_CANDLE_" + item + "_OPEN"}</option>
                                            <option>{"LAST_CANDLE_" + item + "_HIGH"}</option>
                                            <option>{"LAST_CANDLE_" + item + "_LOW"}</option>
                                            <option>{"LAST_CANDLE_" + item + "_CLOSE"}</option>
                                        </React.Fragment>
                                    ))
                                }
                                {
                                    isFuture
                                        ? (
                                            <React.Fragment>
                                                <option>FLAST_ORDER_AVG</option>
                                                <option>FLAST_ORDER_LIMIT</option>
                                                <option>FLAST_ORDER_STOP</option>
                                                <option>INDEX_PRICE</option>
                                                <option>LAST_LIQ_PRICE</option>
                                                <option>MARK_PRICE</option>
                                                <option>POSITION_ENTRY</option>
                                                <option>POSITION_LIQ_PRICE</option>
                                            </React.Fragment>
                                        )
                                        : (
                                            <React.Fragment>
                                                <option>LAST_ORDER_AVG</option>
                                                <option>LAST_ORDER_LIMIT</option>
                                                <option>LAST_ORDER_STOP</option>
                                            </React.Fragment>
                                        )
                                }
                            </select>
                        )
                }
                <span className="input-group-text bg-secondary">
                    X
                </span>
                <input id={props.id + "Multiplier"} type="number" step="any" className="form-control" onChange={props.onChange} placeholder="1" value={priceTemplate.multiplier || ''} />
            </div>
        </div>
    )
}

export default PriceTemplate;
