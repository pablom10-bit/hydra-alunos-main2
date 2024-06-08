import React, { useRef, useState, useEffect } from 'react';
import SelectSymbol from '../../../components/SelectSymbol';
import SwitchInput from '../../../components/SwitchInput';
import { saveAutomation } from '../../../services/AutomationsService';
import ConditionsArea from './ConditionsArea/ConditionsArea';
import { getIndexes, getDefaultIndexes, getFuturesLastOrderIndexes, getFuturesLiquidationIndexes, getLastOrderIndexes } from '../../../services/BeholderService';
import '../Automations.css';
import ActionsArea from './ActionsArea/ActionsArea';
import LogView from '../../../components/Logs/LogView';
import LogButton from '../../../components/Logs/LogButton';
import { getSymbol } from '../../../services/SymbolsService';

/**
 * props:
 * - data
 * - onSubmit
 */
function AutomationModal(props) {

    const [indexes, setIndexes] = useState([]);
    const [error, setError] = useState('');
    const [symbol, setSymbol] = useState({});
    const [showLogs, setShowLogs] = useState(false);

    const DEFAULT_AUTOMATION = {
        id: 0,
        symbol: '',
        conditions: '',
        schedule: '',
        actions: []
    }

    const [automation, setAutomation] = useState(DEFAULT_AUTOMATION);

    const btnClose = useRef('');
    const btnSave = useRef('');

    useEffect(() => {
        const modal = document.getElementById('modalAutomation');
        modal.addEventListener('hidden.bs.modal', (event) => {
            setAutomation({ ...DEFAULT_AUTOMATION });
            setShowLogs(false);
        })
    }, [])

    function onSubmit(event) {
        saveAutomation(automation.id, automation)
            .then(result => {
                btnClose.current.click();
                if (props.onSubmit) props.onSubmit(result);
            })
            .catch(err => {
                console.error(err.response ? err.response.data : err.message);
                setError(err.response ? err.response.data : err.message);
            })
    }

    function onInputChange(event) {
        setAutomation(prevState => ({ ...prevState, [event.target.id]: event.target.value }));
    }

    useEffect(() => {
        if (!props.data) return;
        setAutomation(props.data);
    }, [props.data])



    useEffect(() => {
        if (!automation || !automation.symbol) return;

        const automationSymbol = automation.symbol.toUpperCase();

        if (automationSymbol.startsWith('*'))
            setSymbol({ base: '*', quote: automationSymbol.replace('*', '') });
        else {
            getSymbol(automationSymbol)
                .then(symbolObj => {
                    if (symbolObj)
                        setSymbol(symbolObj)
                    else
                        setIndexes(getDefaultIndexes(automationSymbol))
                })
                .catch(err => {
                    console.error(err.response ? err.response.data : err.message);
                    setError(err.response ? err.response.data : err.message);
                });
        }
    }, [automation.symbol])

    useEffect(() => {
        if (!automation || !automation.symbol) return;

        function removeRepeatedAndSort(indexes) {
            indexes = indexes.filter((item, index, self) =>
                index === self.findIndex(t => t.eval === item.eval)
            )
            return indexes.sort((a, b) => {
                if (a.variable > b.variable) return 1;
                return -1;
            })
        }

        function getWalletIndexes(indexes, symbol) {
            const walletIndexes = [];

            const baseWallet = indexes.find(ix => ix.variable.startsWith('WALLET_') && symbol.base === ix.symbol);
            if (baseWallet) walletIndexes.push(baseWallet);

            const quoteWallet = indexes.find(ix => ix.variable.startsWith('WALLET_') && symbol.quote === ix.symbol.replace('*', ''));
            if (quoteWallet) walletIndexes.push(quoteWallet);

            if (localStorage.getItem("hasFutures") === "true") {
                const baseFWallet = indexes.find(ix => ix.variable.startsWith('FWALLET_') && symbol.base === ix.symbol);
                if (baseFWallet) walletIndexes.push(baseFWallet);

                const quoteFWallet = indexes.find(ix => ix.variable.startsWith('FWALLET_') && symbol.quote === ix.symbol.replace('*', ''));
                if (quoteFWallet) walletIndexes.push(quoteFWallet);
            }

            return walletIndexes;
        }

        getIndexes()
            .then(indexes => {
                const isWildcard = symbol.base === '*';
                let filteredIndexes = isWildcard ? indexes.filter(k => k.symbol.endsWith(symbol.quote)) : indexes.filter(k => k.symbol === automation.symbol);

                if (isWildcard) {
                    filteredIndexes.forEach(ix => {
                        if (/^(F?WALLET_\d+)$/.test(ix.variable)) {
                            ix.symbol = ix.symbol.replace('*', '');
                            ix.eval = ix.eval.replace('*', '');
                        }
                        else {
                            ix.eval = ix.eval.replace(ix.symbol, automation.symbol);
                            ix.symbol = automation.symbol;
                        }
                    })
                }

                const lastOrderIndexes = getLastOrderIndexes(automation.symbol);
                filteredIndexes.push(...lastOrderIndexes);

                if (localStorage.getItem("hasFutures") === "true") {
                    const fLastOrderIndexes = getFuturesLastOrderIndexes(automation.symbol);
                    filteredIndexes.push(...fLastOrderIndexes);

                    const liquidationIndexes = getFuturesLiquidationIndexes(automation.symbol);
                    filteredIndexes.push(...liquidationIndexes);
                }

                filteredIndexes = removeRepeatedAndSort(filteredIndexes);

                if (!isWildcard) {
                    const walletIndexes = getWalletIndexes(indexes, symbol);
                    filteredIndexes.splice(0, 0, ...walletIndexes);
                }

                setIndexes(filteredIndexes);
            })
            .catch(err => {
                console.error(err.response ? err.response.data : err.message);
                setError(err.response ? err.response.data : err.message);
            })
    }, [symbol])

    function onLogClick(event) {
        setShowLogs(!showLogs);
    }

    return (
        <div className="modal fade" id="modalAutomation" tabIndex="-1" role="dialog" aria-labelledby="modalTitleNotify" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <p className="modal-title" id="modalTitleNotify">{props.data.id ? 'Edit ' : 'New '}Automation</p>
                        <button ref={btnClose} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="close"></button>
                    </div>
                    <div className="modal-body">
                        <div className="form-group">
                            <div className="row">
                                <div className="col-md-7 mb-3">
                                    <div className="form-group">
                                        <label htmlFor="symbol">Symbol:</label>
                                        <SelectSymbol onChange={onInputChange} symbol={automation.symbol} disabled={automation.id > 0} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12 mb-3">
                                    <div className="form-group">
                                        <label htmlFor="symbol">Name:</label>
                                        <input className="form-control" id="name" type="text" placeholder="My strategy name" value={automation.name ? automation.name : ''} required onChange={onInputChange} />
                                    </div>
                                </div>
                            </div>
                            {
                                !showLogs
                                    ? (
                                        <>
                                            <ul className="nav nav-tabs" id="tabs" role="tablist">
                                                <li className="nav-item" role="presentation">
                                                    <button className="nav-link active" id="conditions-tab" data-bs-toggle="tab" data-bs-target="#conditions" type="button" role="tab" aria-controls="home" aria-selected="true">
                                                        Conditions
                                                    </button>
                                                </li>
                                                <li className="nav-item" role="presentation">
                                                    <button className="nav-link" id="actions-tab" data-bs-toggle="tab" data-bs-target="#actions" type="button" role="tab" aria-controls="actions" aria-selected="false">
                                                        Actions
                                                    </button>
                                                </li>
                                            </ul>
                                            <div className="tab-content px-3 mb-3" id="tabContent">
                                                <div className="tab-pane fade show active pt-3" id="conditions" role="tabpanel" aria-labelledby="conditions-tab">
                                                    <ConditionsArea symbol={automation.symbol} conditions={automation.conditions} indexes={indexes} onChange={onInputChange} />
                                                </div>
                                                <div className="tab-pane fade" id="actions" role="tabpanel" aria-labelledby="actions-tab">
                                                    <ActionsArea symbol={automation.symbol} actions={automation.actions} onChange={onInputChange} />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <SwitchInput id="isActive" text="Is Active?" onChange={onInputChange} isChecked={automation.isActive} />
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <SwitchInput id="logs" text="Enable Logs?" onChange={onInputChange} isChecked={automation.logs} />
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )
                                    : (
                                        <LogView file={"A:" + automation.id} />
                                    )
                            }

                        </div>
                    </div>
                    <div className="modal-footer">
                        {
                            error
                                ? <div className="alert alert-danger mt-1 col-9 py-1">{error}</div>
                                : <></>
                        }
                        <LogButton id={automation.id} onClick={onLogClick} />
                        <button ref={btnSave} type="button" className="btn btn-sm btn-primary" onClick={onSubmit}>Save</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AutomationModal;
