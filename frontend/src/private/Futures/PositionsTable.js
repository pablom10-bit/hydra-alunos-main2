import React, { useState, useEffect } from 'react';
import { getFuturesPositions, closeAllFuturesPositions, closeFuturesPosition } from '../../services/ExchangeService';
import PositionRow from './PositionRow';

/**
 * props:
 * - data
 */
function PositionsTable(props) {

    const [positions, setPositions] = useState([]);
    const [error, setError] = useState('');
    const [refresh, setRefresh] = useState(0);

    useEffect(() => {
        setError('');

        if (props.data) {
            const positions = Array.isArray(props.data) ? props.data : [props.data];
            setPositions(positions.filter(p => parseFloat(p.notional) !== 0));
        }
        else {
            getFuturesPositions()
                .then(positions => setPositions(positions.filter(p => parseFloat(p.notional) !== 0)))
                .catch(err => {
                    console.error(err.response ? err.response.data : err.message);
                    setError(err.response ? err.response.data : err.message);
                })

            const timer = setTimeout(() => {
                setRefresh(Date.now());
            }, 60000);

            return () => clearTimeout(timer);
        }
    }, [refresh])

    function onCloseAllClick(event) {
        setError('');
        closeAllFuturesPositions()
            .then(result => setRefresh(Date.now()))
            .catch(err => {
                console.error(err.response ? err.response.data : err.message);
                setError(err.response ? err.response.data : err.message);
            })
    }

    function onCloseClick(event) {
        setError("");
        const symbol = event.target.id.replace("close", "");
        closeFuturesPosition(symbol)
            .then(result => setRefresh(Date.now()))
            .catch(err => {
                console.error(err.response ? err.response.data : err.message);
                setError(err.response ? err.response.data : err.message);
            })
    }

    return (
        <React.Fragment>
            <div className='row mt-3'>
                <div className='col-12'>
                    <div className='card border-0 shadow'>
                        <div className='card-header'>
                            <div className='row align-items-center'>
                                <div className='col'>
                                    <h2 className='fs-5 fw-0 bold'>Futures Positions USDT</h2>
                                </div>
                            </div>
                        </div>
                        <div className='table-responsive'>
                            <table className='table align-items-center table-flush'>
                                <thead className='thead-light'>
                                    <tr>
                                        <th className='border-bottom' scope="col">Symbol</th>
                                        <th className='border-bottom' scope="col">Size</th>
                                        <th className='border-bottom' scope="col">Entry Price</th>
                                        <th className='border-bottom' scope="col">Mark Price</th>
                                        <th className='border-bottom' scope="col">Liq. Price</th>
                                        <th className='border-bottom' scope="col">Margin</th>
                                        <th className='border-bottom' scope="col">PnL</th>
                                        <th className='border-bottom' scope="col">Close</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        positions && positions.length
                                            ? positions.map(item => <PositionRow key={item.symbol} data={item} onClose={onCloseClick} />)
                                            : <tr><td>No opened positions.</td></tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div className='card-footer'>
                            <div className='row'>
                                <div className='col'>
                                    <button className='btn btn-primary animate-up-2' type="button" onClick={() => setRefresh(Date.now())}>
                                        <svg className="icon icon-xs" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                        </svg> Sync
                                    </button>
                                    {
                                        positions && positions.length
                                            ? (
                                                <button className='btn btn-danger animate-up-2 ms-2' type="button" onClick={onCloseAllClick}>
                                                    <svg className="icon icon-xs" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                                    </svg> Close All
                                                </button>
                                            )
                                            : <React.Fragment></React.Fragment>
                                    }
                                </div>
                                <div className='col'>
                                    {
                                        error
                                            ? (
                                                <div className='alert alert-danger'>
                                                    {error}
                                                </div>
                                            )
                                            : <React.Fragment></React.Fragment>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default PositionsTable;