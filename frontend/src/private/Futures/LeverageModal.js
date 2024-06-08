import React, { useRef, useState, useEffect } from 'react';
import { updateFuturesPosition } from '../../services/ExchangeService';

/**
 * props:
 * - position
 * - onSubmit
 */
function LeverageModal(props) {

    const [position, setPosition] = useState(null);
    const [error, setError] = useState('');
    const [leverage, setLeverage] = useState(props.position ? props.position.leverage : 1);
    const btnClose = useRef('');

    function onSubmit(event) {
        setError("");
        updateFuturesPosition(position.symbol, { leverage })
            .then(result => {
                btnClose.current.click();
                if (props.onSubmit) props.onSubmit(result);
            })
            .catch(err => {
                console.error(err.response ? err.response.data : err.message);
                setError(err.response ? err.response.data : err.message);
            })
    }

    useEffect(() => {
        setPosition(props.position);
        if (!props.position) return;

        setLeverage(props.position.leverage);
    }, [props.position])

    function getLeverage(position) {
        if (position && position.leverage)
            return `Leverage ${position.leverage}x`;
        return "Loading Leverage...";
    }

    function decrement() {
        setLeverage(parseInt(leverage) - 1);
    }

    function increment() {
        setLeverage(parseInt(leverage) + 1);
    }

    function onInputChange(event) {
        setLeverage(parseInt(event.target.value));
    }

    return (
        <React.Fragment>
            <button className='btn btn-secondary col-12' data-bs-toggle="modal" data-bs-target="#modalLeverage">
                {getLeverage(position)}
            </button>
            <div className="modal fade" id="modalLeverage" tabIndex="-1" role="dialog">
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <p className="modal-title" id="modalTitleNotify">
                                {position ? position.symbol : ""} Perpetual
                            </p>
                            <button ref={btnClose} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <div className="row">
                                    <div className="col-md-12 mb-3">
                                        <div className="form-group">
                                            <label htmlFor="leverage">Leverage:</label>
                                            <div className='input-group'>
                                                <button type="button" className='btn btn-secondary' onClick={decrement}>-</button>
                                                <input type="number" step={1} id="leverage" value={leverage} onChange={onInputChange} className="form-control" placeholder='1' />
                                                <span className='input-group-text'>x</span>
                                                <button type="button" className='btn btn-secondary' onClick={increment}>+</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            {
                                error
                                    ? <div className="alert alert-danger mt-1 col-9 py-1">{error}</div>
                                    : <React.Fragment></React.Fragment>
                            }
                            <button type="button" className="btn btn-sm btn-primary" onClick={onSubmit}>Confirm</button>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    )
}

export default LeverageModal;
