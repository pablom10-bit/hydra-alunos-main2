import React from 'react';

/**
 * props:
 * - marginType
 * - onChange
 */
function MarginSelect(props) {
    return (
        <select id="marginType" className="form-select" value={props.marginType || 'CROSSED'} onChange={props.onChange}>
            <option>CROSSED</option>
            <option>ISOLATED</option>
        </select>
    )
}

export default MarginSelect;