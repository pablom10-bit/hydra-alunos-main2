import React from 'react';

/**
 * props:
 * - data
 * - onClose
 */
function PositionRow(props) {

    function getSize() {
        if (!props.data) return;
        const notional = parseFloat(props.data.notional);
        return notional > 0
            ? <span className='text-success'>{notional.toFixed(2)}</span>
            : <span className='text-danger'>{notional.toFixed(2)}</span>;
    }

    function getPnL() {
        if (!props.data) return;
        const pnl = parseFloat(props.data.unRealizedProfit);
        return pnl > 0
            ? <span className='text-success'>{"+" + pnl.toFixed(2)}</span>
            : <span className='text-danger'>{pnl.toFixed(2)}</span>;
    }

    return (
        <tr>
            <td className='text-gray-900'>
                {props.data.symbol}
                <span className='badge bg-secondary'>{props.data.leverage}x</span>
            </td>
            <td className='text-gray-900'>
                {getSize()}
            </td>
            <td className='text-gray-900'>
                {parseFloat(props.data.entryPrice).toFixed(2)}
            </td>
            <td className='text-gray-900'>
                {parseFloat(props.data.markPrice).toFixed(2)}
            </td>
            <td className='text-gray-900'>
                {parseFloat(props.data.liquidationPrice).toFixed(2)}
            </td>
            <td className='text-gray-900'>
                {parseFloat(props.data.isolatedMargin).toFixed(2)}
                <span className='badge bg-secondary'>{props.data.marginType[0]}</span>
            </td>
            <td className='text-gray-900'>
                {getPnL()}
            </td>
            <td>
                <button id={"close" + props.data.symbol} className='btn btn-sm btn-danger animate-up-2 ms-2' type="button" onClick={props.onClose}>
                    <svg className="icon icon-xs" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                    </svg>
                </button>
            </td>
        </tr>
    )
}

export default PositionRow;