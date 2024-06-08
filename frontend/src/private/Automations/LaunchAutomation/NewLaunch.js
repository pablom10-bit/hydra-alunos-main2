import React, { useState, useEffect } from "react";
import Menu from "../../../components/Menu/Menu";
import { useParams, useNavigate } from "react-router-dom";
import Footer from "../../../components/Footer";
import Toast from "../../../components/Toast";
import DateTime from "../../../components/DateTime";
import QuantityInput from "../../../components/NewOrder/QuantityInput";
import ConditionsArea from "../AutomationModal/ConditionsArea/ConditionsArea";
import SwitchInput from "../../../components/SwitchInput";
import LogButton from "../../../components/Logs/LogButton";
import { getAutomation, saveLaunchAutomation } from "../../../services/AutomationsService";

function NewLaunch() {

    const { id } = useParams();

    const navigate = useNavigate();

    const DEFAULT_AUTOMATION = {
        id: 0,
        symbol: "BTCUSDT",
        name: "",
        indexes: "",
        conditions: "",
        isActive: false,
        logs: false,
        pingTuning: false,
        quantity: "0",
        schedule: "",
        userId: 0,
        actions: []
    }

    const DEFAULT_SYMBOL = {
        base: "BTC",
        quote: "USDT"
    }

    const [symbol, setSymbol] = useState(DEFAULT_SYMBOL);
    const [automation, setAutomation] = useState(DEFAULT_AUTOMATION);
    const [indexes, setIndexes] = useState([]);
    const [error, setError] = useState("");
    const [showLogs, setShowLogs] = useState(false);

    useEffect(() => {
        if (!symbol) return;

        function getWalletIndexes(symbol) {
            const userId = parseInt(localStorage.getItem("id"));

            const baseWallet = {
                eval: `MEMORY['${symbol.base}:WALLET_${userId}']`,
                example: 1,
                symbol: symbol.base,
                variable: `WALLET_${userId}`
            }

            const quoteWallet = {
                eval: `MEMORY['${symbol.quote}:WALLET_${userId}']`,
                example: 1,
                symbol: symbol.quote,
                variable: `WALLET_${userId}`
            }

            return [baseWallet, quoteWallet];
        }

        function getSimulatedIndexes(symbol) {
            const userId = parseInt(localStorage.getItem("id"));

            const lastOrder = [{
                eval: `MEMORY['${symbol}:LAST_ORDER_${userId}'].avgPrice`,
                example: 1,
                symbol,
                variable: `LAST_ORDER_${userId}.avgPrice`
            }, {
                eval: `MEMORY['${symbol}:LAST_ORDER_${userId}'].side`,
                example: "BUY",
                symbol,
                variable: `LAST_ORDER_${userId}.side`
            }, {
                eval: `MEMORY['${symbol}:LAST_ORDER_${userId}'].status`,
                example: "FILLED",
                symbol,
                variable: `LAST_ORDER_${userId}.status`
            }];

            const book = [{
                eval: `MEMORY['${symbol}:BOOK'].bestAsk`,
                example: 1,
                symbol,
                variable: `BOOK.bestAsk`
            }, {
                eval: `MEMORY['${symbol}:BOOK'].bestBid`,
                example: 1,
                symbol,
                variable: `BOOK.bestBid`
            }]

            return [...book, ...lastOrder];
        }

        const indexes = getWalletIndexes(symbol);
        const simulatedIndexes = getSimulatedIndexes(automation.symbol);
        indexes.push(...simulatedIndexes);
        setIndexes(indexes);

    }, [automation.symbol])

    useEffect(() => {
        if (!id) return;

        getAutomation(id)
            .then(automation => {
                setAutomation({
                    symbol: automation.symbol,
                    schedule: automation.schedule,
                    quantity: automation.actions[0].orderTemplate.quantityMultiplier,
                    conditions: automation.conditions,
                    indexes: automation.indexes,
                    isActive: automation.isActive,
                    logs: automation.logs,
                    pingTuning: automation.actions.length > 2 && automation.actions[2].type === "PING"
                })
            })
    }, [id])

    const launchQuotes = ["USDT", "BNB", "FDUSD"];
    function getQuote(symbol) {
        for (let i = 0; i < launchQuotes.length; i++) {
            const quote = launchQuotes[i];
            if (symbol.endsWith(quote))
                return quote;
        }
        return "USDT";
    }

    function onAutomationChange(event) {
        setError("");
        setAutomation(prevState => ({ ...prevState, [event.target.id]: event.target.value }));

        if (event.target.id === "symbol") {
            const quote = getQuote(event.target.value);
            setSymbol({
                base: event.target.value.replace(quote, ""),
                quote
            })
        }
    }

    function onLogClick() {
        setShowLogs(!showLogs);
    }

    function onSubmit() {
        setError("");
        saveLaunchAutomation(id, automation)
            .then(result => navigate("/automations"))
            .catch(err => {
                console.error(err);
                setError(err.response ? err.response.data : err.message);
            })
    }

    return (
        <>
            <Menu />
            <main className="content">
                <div className="card card-body shadow border-0 mb-4 mt-4">
                    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                        <div className="d-block mb-4 mb-md-0">
                            <h2 className="h4">{id ? "Edit" : "New"} Launch Automation</h2>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="row">
                            <div className="col-md-3 mb-3">
                                <div className="form-group">
                                    <label htmlFor="symbol">New Symbol:</label>
                                    <input type="text" id="symbol" onChange={onAutomationChange} value={automation.symbol} className="form-control" placeholder="BTCUSDT" />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <div className="form-group">
                                    <label htmlFor="schedule">Launch Date &amp; Time (UTC-3):</label>
                                    <DateTime id="schedule" date={Date.parse(automation.schedule) ? automation.schedule : ""} onChange={onAutomationChange} />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-3 mb-3">
                                <QuantityInput id="quantity" quantity={automation.quantity} onChange={onAutomationChange} text="Buy Order Quantity:" symbol={symbol} isQuote={true} allowQuote={true} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-9">
                                <ul className="nav nav-tabs" id="tabs" role="tablist">
                                    <li className="nav-item" role="presentation">
                                        <button className="nav-link active" id="conditions-tab" data-bs-toggle="tab" data-bs-target="#conditions" type="button" role="tab">
                                            Exit Condition
                                        </button>
                                    </li>
                                </ul>
                                <div className="tab-content px-3 mb-3" id="tabContent">
                                    <div className="tab-pane fade show active pt-3" id="conditions" role="tabpanel">
                                        <ConditionsArea symbol={automation.symbol} conditions={automation.conditions} indexes={indexes} onChange={onAutomationChange} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-3">
                                <div className="form-group">
                                    <SwitchInput id="isActive" text="Is Active?" onChange={onAutomationChange} isChecked={automation.isActive} />
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <SwitchInput id="logs" text="Enable Logs?" onChange={onAutomationChange} isChecked={automation.logs} />
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <SwitchInput id="pingTuning" text="Ping Tuning?" onChange={onAutomationChange} isChecked={automation.pingTuning} />
                                </div>
                            </div>
                        </div>
                        <div className="row mt-3">
                            <div className="col-md-6 mb-3">
                                <LogButton id={automation.id} onClick={onLogClick} isVisible={true} />
                                <button type="button" className="btn btn-primary" onClick={onSubmit}>
                                    Save Automation
                                </button>
                                <a href="/automations" className="btn btn-light">Cancel</a>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                {
                                    error
                                        ? <div className="alert alert-danger mt-1 col-12 py-1">{error}</div>
                                        : <></>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </main>
            <Toast />
        </>
    )
}

export default NewLaunch;