import React, { useMemo } from 'react';

/**
 * props:
 * - side
 * - isFuture
 * - onChange
 */
function SelectSide(props) {

    const selectSide = useMemo(() => {
        return (
            <div className="form-group">
                <label htmlFor="side">Side:</label>
                <select id="side" className="form-select" value={props.side} onChange={props.onChange}>
                    <option value="BUY">Buy{props.isFuture ? " / Long" : ""}</option>
                    <option value="SELL">Sell{props.isFuture ? " / Short" : ""}</option>
                </select>
            </div>
        )
    }, [props.side, props.isFuture])

    return selectSide;
}

export default SelectSide;