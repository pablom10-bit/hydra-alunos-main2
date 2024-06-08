import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Menu from '../../components/Menu/Menu';
import SelectSymbol from '../../components/SelectSymbol';
import SymbolPrice from '../../components/SymbolPrice';
import WalletSummary from '../../components/WalletSummary';
import { getMemoryIndex } from '../../services/BeholderService';
import LeverageModal from './LeverageModal';
import { getSymbol } from '../../services/SymbolsService';
import MarginModal from './MarginModal';
import SelectSide from '../../components/NewOrder/SelectSide';
import OrderType from '../../components/NewOrder/OrderType';
import PositionsTable from './PositionsTable';
import Footer from '../../components/Footer';
import Toast from '../../components/Toast';
import { placeOrder } from '../../services/OrdersService';
import { LIMIT_TYPES, MARKET_TYPES, STOP_TYPES } from '../../services/ExchangeService';
import QuantityInput from '../../components/NewOrder/QuantityInput';
import SwitchInput from '../../components/SwitchInput';

function NewOrder() {

    const navigate = useNavigate();

    const btnSend = useRef('');
    const inputTotal = useRef('');

    const DEFAULT_ORDER = {
        symbol: "",
        limitPrice: "0",
        stopPrice: "0",
        activationPrice: "0",
        callbackRate: "0",
        quantity: "0",
        side: "BUY",
        type: "LIMIT",
        reduceOnly: false
    }

    const [order, setOrder] = useState(DEFAULT_ORDER);
    const [error, setError] = useState('');
    const [symbol, setSymbol] = useState(null);
    const [position, setPosition] = useState(null);
    const [refreshPosition, setRefreshPosition] = useState(0);
    const [wallet, setWallet] = useState({ base: { symbol: "", qty: 0 }, quote: { symbol: "", qty: 0 } });

    function errorHandling(err) {
        console.error(err.response ? err.response.data : err.message);
        setError(err.response ? err.response.data : err.message);
    }

    useEffect(() => {
        if (!order.symbol) return;
        getSymbol(order.symbol)
            .then(symbol => {
                if (symbol) return setSymbol(symbol);
                throw new Error(`Symbol not found!`);
            })
            .catch(err => errorHandling(err))
    }, [order.symbol])

    useEffect(() => {
        if (!order.symbol) return;
        getMemoryIndex(order.symbol, "POSITION", null)
            .then(position => setPosition(position))
            .catch(err => errorHandling(err));
    }, [order.symbol, refreshPosition])

    useEffect(() => {
        if (!symbol || !symbol.base) return;
        loadWallet(symbol);
    }, [symbol])

    useEffect(() => {
        setError("");
        if (btnSend.current) btnSend.current.disabled = false;

        const quantity = typeof order.quantity === 'string'
            ? parseFloat(order.quantity.replace(",", ""))
            : order.quantity;

        if (!quantity) return;

        if (quantity && quantity < parseFloat(symbol.fMinLotSize)) {
            btnSend.current.disabled = true;
            return setError(`Min. Lot Size: ${symbol.fMinLotSize}`);
        }

        const price = parseFloat(order.limitPrice);
        if (!price) return;

        const total = quantity * price;

        if (inputTotal.current)
            inputTotal.current.value = `${total}`.substring(0, 8);

        const minNotional = parseFloat(symbol.fMinNotional);
        if(total < minNotional){
            btnSend.current.disabled = true;
            return setError(`Min. Notional: ${symbol.fMinNotional}`);
        }

    }, [order.quantity, order.limitPrice, symbol])

    async function loadWallet(symbol) {
        try {
            const baseQty = await getMemoryIndex(symbol.base, 'FWALLET', null);
            const quoteQty = await getMemoryIndex(symbol.quote, 'FWALLET', null);
            setWallet({
                base: { symbol: symbol.base, qty: baseQty },
                quote: { symbol: symbol.quote, qty: quoteQty }
            })
        }
        catch (err) {
            errorHandling(err);
        }
    }

    function onSymbolChange(event) {
        setError("");
        setOrder({ ...DEFAULT_ORDER, symbol: event.target.value });
    }

    function onPriceChange(book) {
        if (!MARKET_TYPES.includes(order.type) || !inputTotal.current) return;

        const quantity = typeof order.quantity === 'string'
            ? parseFloat(order.quantity.replace(",", ""))
            : order.quantity;

        if (quantity) {
            btnSend.current.disabled = false;

            if (order.side === 'BUY')
                inputTotal.current.value = `${quantity * parseFloat(book.ask)}`.substring(0, 8);
            else
                inputTotal.current.value = `${quantity * parseFloat(book.bid)}`.substring(0, 8);

            if (parseFloat(inputTotal.current.value) < parseFloat(symbol.fMinNotional)) {
                btnSend.current.disabled = true;
                return setError(`Min. Notional: ${symbol.fMinNotional}`);
            }
        }
    }

    function scheduleRefresh() {
        setPosition(null);
        setTimeout(() => {
            setRefreshPosition(Date.now());
        }, 2000)
    }

    function onInputChange(event) {
        setError("");
        setOrder(prevState => ({ ...prevState, [event.target.id]: event.target.value }));
    }

    function onSubmit(event) {
        setError("");
        placeOrder(order, true)
            .then(result => navigate("/forders/" + order.symbol))
            .catch(err => errorHandling(err));
    }

    function getTrailingStopClasses(type) {
        return type === "TRAILING_STOP_MARKET"
            ? "row"
            : "d-none";
    }

    function getLimitClasses(type) {
        return LIMIT_TYPES.includes(type)
            ? 'col-md-6 mb-3'
            : "col-md-6 mb-3 d-none";
    }

    function getStopClasses(type) {
        return STOP_TYPES.includes(type)
            ? 'col-md-6 mb-3'
            : "col-md-6 mb-3 d-none";
    }

    return (
        <React.Fragment>
            <Menu />
            <main className='content'>
                <div className='card card-body shadow border-0 mb-4 mt-4'>
                    <div className='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4'>
                        <div className='d-block mb-4 mb-md-0'>
                            <h2 className='h4'>New Future Order</h2>
                        </div>
                    </div>
                    <div className='form-group'>
                        <div className='row'>
                            <div className='col-md-6 mb-3'>
                                <div className='form-group'>
                                    <label htmlFor='symbol'>Perpetual Contract:</label>
                                    <SelectSymbol symbol={order.symbol} onChange={onSymbolChange} onlyFutures={true} />
                                </div>
                            </div>
                            <div className='col-md-6 mb-3'>
                                {
                                    order.symbol
                                        ? <SymbolPrice symbol={order.symbol} onChange={onPriceChange} />
                                        : <React.Fragment></React.Fragment>
                                }
                            </div>
                        </div>
                        {
                            order.symbol
                                ? (
                                    <div className='row'>
                                        <div className='col-md-6 mb-3'>
                                            <WalletSummary wallet={wallet} />
                                        </div>
                                        <div className='col-md-3 mb-3'>
                                            <MarginModal position={position} onSubmit={scheduleRefresh} />
                                        </div>
                                        <div className='col-md-3 mb-3'>
                                            <LeverageModal position={position} onSubmit={scheduleRefresh} />
                                        </div>
                                    </div>
                                )
                                : <React.Fragment></React.Fragment>
                        }
                        <div className='row'>
                            <div className='col-md-6 mb-3'>
                                <SelectSide side={order.side} isFuture={true} onChange={onInputChange} />
                            </div>
                            <div className='col-md-6 mb-3'>
                                <OrderType isFuture={true} type={order.type} onChange={onInputChange} />
                            </div>
                        </div>
                        <div className={getTrailingStopClasses(order.type)}>
                            <div className='col-md-6 mb-3'>
                                <label htmlFor='activationPrice'>Activation Price:</label>
                                <input type="number" id="activationPrice" onChange={onInputChange} value={order.activationPrice} className="form-control" placeholder='0' />
                            </div>
                            <div className='col-md-6 mb-3'>
                                <label htmlFor='callbackRate'>Callback Rate:</label>
                                <div className='input-group'>
                                    <input type="number" id="callbackRate" onChange={onInputChange} value={order.callbackRate} className="form-control" placeholder='1' />
                                    <span className='input-group-text bg-secondary'>%</span>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className={getStopClasses(order.type)}>
                                <label htmlFor='stopPrice'>Stop Price:</label>
                                <input type="number" id="stopPrice" onChange={onInputChange} value={order.stopPrice} className="form-control" placeholder='0' />
                            </div>
                        </div>
                        <div className="row">
                            <div className={getLimitClasses(order.type)}>
                                <label htmlFor='limitPrice'>Limit Price:</label>
                                <input type="number" id="limitPrice" onChange={onInputChange} value={order.limitPrice} className="form-control" placeholder='0' />
                            </div>
                            <div className='col-md-6 mb-3'>
                                <QuantityInput id="quantity" quantity={order.quantity} onChange={onInputChange} text="Quantity:" symbol={symbol} isQuote={false} allowQuote={false} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label htmlFor='total'>Notional Total:</label>
                                <input type="number" disabled={true} id="total" ref={inputTotal} className="form-control" placeholder='0' />
                            </div>
                            <div className='col-md-6 mb-3 mt-5'>
                                <SwitchInput id="reduceOnly" onChange={onInputChange} text="Reduce Only?" isChecked={order.reduceOnly} />
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col-md-6 mb-3'>
                                <button ref={btnSend} type="button" className='btn btn-primary' onClick={onSubmit}>Send Order</button>
                                <a href="/forders/" className='btn btn-light'>Cancel</a>
                            </div>
                            <div className='col-md-6 mb-3'>
                                {
                                    error
                                        ? <div className="alert alert-danger mt-1 col-12 py-1">{error}</div>
                                        : <React.Fragment></React.Fragment>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                {
                    position
                        ? <PositionsTable data={position} />
                        : <React.Fragment></React.Fragment>
                }
                <Footer />
            </main>
            <Toast />
        </React.Fragment>
    )
}

export default NewOrder;