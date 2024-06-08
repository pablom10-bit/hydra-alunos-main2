import React, { useRef, useState, useEffect } from 'react';
import MarginSelect from '../../components/MarginSelect';
import { updateFuturesPosition } from '../../services/ExchangeService';

/**
 * props:
 * - position
 * - onSubmit
 */
function MarginModal(props) {

    const [position, setPosition] = useState(null);
    const [error, setError] = useState('');
    const [marginType, setMarginType] = useState('CROSSED');
    const btnClose = useRef('');

    function onSubmit(event) {
        updateFuturesPosition(position.symbol, { marginType })
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
        if (!props.position) return;
        setPosition(props.position);
    }, [props.position])

    function getMarginType(position) {
        if (position && position.marginType)
            return `Margin ${position.marginType.toUpperCase()}`;
        return "Loading Margin...";
    }

    return (
        <React.Fragment>
            <button className='btn btn-secondary col-12' data-bs-toggle="modal" data-bs-target="#modalMargin">
                {getMarginType(position)}
            </button>
            <div className="modal fade" id="modalMargin" tabIndex="-1" role="dialog">
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
                                            <label htmlFor="marginType">Margin Mode:</label>
                                            <MarginSelect marginType={marginType.toUpperCase()} onChange={(event) => setMarginType(event.target.value)} />
                                        </div>
                                    </div>
                                    <div>
                                        <p>
                                            Switching the margin mode will only apply it to the selected contract.
                                        </p>
                                    </div>
                                    <hr />
                                    <div>
                                        <p>
                                            <b>Cross Margin Mode:</b> All cross positions under the same margin asset share the same asset cross margin balance. In the event of liquidation, your assets full margin balance along with any remaining open positions under the asset may be forfeited.
                                        </p>
                                        <p>
                                            <b>Isolated Margin Mode:</b> Manage your risk on individual positions by restricting the amount of margin allocated to each. If the margin ratio of a position reached 100%, the position will be liquidated. Margin can be added or removed to positions using this mode.
                                        </p>
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

export default MarginModal;
