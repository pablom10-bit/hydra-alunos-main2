import React, { useMemo } from 'react';

/**
 * props:
 * - type
 * - isFuture
 * - onChange
 */
function OrderType(props) {

    const orderType = useMemo(() => {
        return (
            <div className="form-group">
                <label htmlFor="type">Type:</label>
                <select id="type" className="form-select" value={props.type} onChange={props.onChange}>
                    <option value="LIMIT">Limit</option>
                    <option value="MARKET">Market</option>
                    {
                        props.isFuture
                            ? (
                                <React.Fragment>
                                    <option value="STOP">Stop Loss Limit</option>
                                    <option value="STOP_MARKET">Stop Loss Market</option>
                                    <option value="TAKE_PROFIT">Take Profit Limit</option>
                                    <option value="TAKE_PROFIT_MARKET">Take Profit Market</option>
                                    <option value="TRAILING_STOP_MARKET">Trailing Stop</option>
                                </React.Fragment>
                            )
                            : (
                                <React.Fragment>
                                    <option value="STOP_LOSS_LIMIT">Stop Loss Limit</option>
                                    <option value="TAKE_PROFIT_LIMIT">Take Profit Limit</option>
                                    <option value="TRAILING_STOP">Trailing Stop</option>
                                </React.Fragment>
                            )
                    }
                </select>
            </div>
        )
    }, [props.type, props.isFuture])

    return orderType;
}

export default OrderType;