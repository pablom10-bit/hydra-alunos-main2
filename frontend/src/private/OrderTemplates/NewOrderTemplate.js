import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SelectSymbol from '../../components/SelectSymbol';
import SelectSide from '../../components/NewOrder/SelectSide';
import OrderType from '../../components/NewOrder/OrderType';
import { saveOrderTemplate, getOrderTemplate } from '../../services/OrderTemplatesService';
import { MARKET_TYPES, STOP_TYPES } from '../../services/ExchangeService';
import PriceTemplate from './PriceTemplate';
import QuantityTemplate from './QuantityTemplate';
import TrailingTemplate from './TrailingTemplate';
import Menu from '../../components/Menu/Menu';
import Footer from '../../components/Footer';
import Toast from '../../components/Toast';
import MarginSelect from '../../components/MarginSelect';
import SwitchInput from '../../components/SwitchInput';

function NewOrderTemplate() {

    const navigate = useNavigate();

    const { orderTemplateId } = useParams();

    const DEFAULT_ORDER_TEMPLATE = {
        name: '',
        symbol: '',
        type: 'MARKET',
        side: 'BUY',
        limitPrice: '',
        limitPriceMultiplier: 1,
        stopPrice: '',
        stopPriceMultiplier: 1,
        quantity: '',
        quantityMultiplier: 1,
        marginType: null,
        reduceOnly: null,
        leverage: null
    }

    const [error, setError] = useState('');
    const [market, setMarket] = useState('SPOT');
    const [orderTemplate, setOrderTemplate] = useState({ ...DEFAULT_ORDER_TEMPLATE, id: orderTemplateId });

    useEffect(() => {
        if (!orderTemplateId) return;
        getOrderTemplate(orderTemplateId)
            .then(ot => {
                setOrderTemplate(ot);
                setMarket(ot.leverage !== null && ot.leverage !== undefined ? "FUTURES" : "SPOT");
            })
            .catch(err => {
                console.error(err.response ? err.response.data : err.message);
                setError(err.response ? err.response.data : err.message);
            })
    }, [orderTemplateId])

    function onSubmit(event) {
        if (market === "FUTURES") {
            orderTemplate.leverage = parseInt(orderTemplate.leverage) || 0;
            orderTemplate.marginType = orderTemplate.marginType || "CROSSED";
            orderTemplate.reduceOnly = orderTemplate.reduceOnly || false;
        }

        saveOrderTemplate(orderTemplateId || orderTemplate.id, orderTemplate)
            .then(result => navigate((
                market === "FUTURES" ? '/fOrderTemplates/' : '/orderTemplates/') + orderTemplate.symbol))
            .catch(err => {
                console.error(err.response ? err.response.data : err.message);
                setError(err.response ? err.response.data : err.message);
            })
    }

    function onInputChange(event) {
        setOrderTemplate(prevState => ({ ...prevState, [event.target.id]: event.target.value }));
    }

    function getPriceClasses(orderType) {
        if (!orderType) return "col-md-6 mb-3 d-none";
        return MARKET_TYPES.includes(orderType) ? "col-md-6 mb-3 d-none" : "col-md-6 mb-3";
    }

    function getStopPriceClasses(orderType) {
        return STOP_TYPES.includes(orderType) ? "col-md-6 mb-3" : "col-md-6 mb-3 d-none";
    }

    return (
        <React.Fragment>
            <Menu />
            <main className='content'>
                <div className='card card-body border-0 shadow mb-4 mt-4'>
                    <div className='d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4'>
                        <div className='d-block md-4 mb-md-0'>
                            <h2 className='h4'>{orderTemplateId ? "Edit" : "New"} Order Template</h2>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label htmlFor="market">Market:</label>
                                <select className='form-select' id="market" value={market} onChange={(event) => setMarket(event.target.value)} disabled={orderTemplateId > 0}>
                                    <option value="SPOT">Spot</option>
                                    <option value="FUTURES">Futures</option>
                                </select>
                            </div>
                            <div className="col-md-4 mb-3">
                                <label htmlFor="symbol">Symbol:</label>
                                <SelectSymbol symbol={orderTemplate.symbol} onChange={onInputChange} onlyFavorites={false} showAny={true} disabled={orderTemplate.id > 0} onlyFutures={market === "FUTURES"} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-8 mb-3">
                                <label htmlFor="name">Name:</label>
                                <input id="name" type="text" className="form-control" value={orderTemplate.name || ''} placeholder="My Template Name" onChange={onInputChange} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <SelectSide side={orderTemplate.side} onChange={onInputChange} isFuture={market === "FUTURES"} />
                            </div>
                            <div className="col-md-4 mb-3">
                                <OrderType type={orderTemplate.type} onChange={onInputChange} isFuture={market === "FUTURES"} />
                            </div>
                        </div>
                        {
                            market === "FUTURES"
                                ? (
                                    <React.Fragment>
                                        <div className="row">
                                            <div className="col-md-4 mb-3">
                                                <label htmlFor="marginType">Margin Type:</label>
                                                <MarginSelect marginType={orderTemplate.marginType} onChange={onInputChange} />
                                            </div>
                                            <div className="col-md-2 mb-3">
                                                <label htmlFor="leverage">Leverage:</label>
                                                <div className='input-group'>
                                                    <input type="number" step={1} value={orderTemplate.leverage || "0"} placeholder="0" id="leverage" className='form-control' onChange={onInputChange} />
                                                    <span className='input-group-text bg-secondary'>x</span>
                                                </div>
                                            </div>
                                            <div className="col-md-4 mb-3 mt-4">
                                                <SwitchInput id="reduceOnly" text="Reduce Only?" isChecked={orderTemplate.reduceOnly || false} onChange={onInputChange} />
                                            </div>
                                        </div>
                                    </React.Fragment>
                                )
                                : <React.Fragment></React.Fragment>
                        }
                        {
                            orderTemplate.type && orderTemplate.type.startsWith('TRAILING_STOP')
                                ? <TrailingTemplate data={orderTemplate} onChange={onInputChange} isFuture={market === "FUTURES"} />
                                : (
                                    <div className="row">
                                        <div className={getPriceClasses(orderTemplate.type)}>
                                            <PriceTemplate id="limitPrice" text="Limit Price:" isFuture={market === "FUTURES"} symbol={orderTemplate.symbol} onChange={onInputChange} price={orderTemplate.limitPrice} multiplier={orderTemplate.limitPriceMultiplier} />
                                        </div>
                                        <div className={getStopPriceClasses(orderTemplate.type)}>
                                            <PriceTemplate id="stopPrice" text="Stop Price:" isFuture={market === "FUTURES"} symbol={orderTemplate.symbol} onChange={onInputChange} price={orderTemplate.stopPrice} multiplier={orderTemplate.stopPriceMultiplier} />
                                        </div>
                                    </div>
                                )
                        }
                        <div className="row">
                            <div className="col-md-6 mb-4">
                                <QuantityTemplate id="quantity" text="Quantity:" isFuture={market === "FUTURES"} quantity={orderTemplate.quantity} multiplier={orderTemplate.quantityMultiplier} onChange={onInputChange} />
                            </div>
                        </div>
                        <div className='row'>
                            <div className="col-md-6 mb-3">
                                <button type="button" className="btn btn-primary" onClick={onSubmit}>Save Template</button>
                                <a href="/orderTemplates" className='btn btn-light'>Cancel</a>
                            </div>
                            {
                                error
                                    ? <div className="alert alert-danger mt-1 col-md-6 py-1">{error}</div>
                                    : <React.Fragment></React.Fragment>
                            }
                        </div>
                    </div>
                </div>
                <Footer />
            </main>
            <Toast />
        </React.Fragment>
    )
}

export default NewOrderTemplate;
