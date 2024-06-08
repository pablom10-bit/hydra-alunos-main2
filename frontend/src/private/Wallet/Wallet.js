import React, { useState, useEffect } from 'react';
import { getFullBalance } from '../../services/ExchangeService';
import Menu from '../../components/Menu/Menu';
import Footer from '../../components/Footer';
import WalletRow from './WalletRow';
import Toast from '../../components/Toast';
import NewOrderModal from '../../components/NewOrder/NewOrderModal';
import NewOrderButton from '../../components/NewOrder/NewOrderButton';
import SelectFiat, { setDefaultFiat, getDefaultFiat } from '../../components/SelectFiat';

function Wallet() {

    const [balances, setBalances] = useState([]);
    const [fiat, setFiat] = useState(getDefaultFiat());
    const [totalFiat, setTotalFiat] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isFuture, setIsFuture] = useState(false);

    const [notification, setNotification] = useState({ type: '', text: '' });

    useEffect(() => {
        if (!fiat) return;

        setIsLoading(true);
        getFullBalance(fiat, isFuture)
            .then((info) => {
                const balances = Object.entries(info).map(item => {
                    return {
                        symbol: item[0],
                        available: item[1].available,
                        onOrder: item[1].onOrder,
                        fiatEstimate: item[1].fiatEstimate,
                        avg: item[1].avg
                    }
                })
                    .sort((a, b) => {
                        if (a.symbol > b.symbol) return 1;
                        if (a.symbol < b.symbol) return -1;
                        return 0;
                    });

                setBalances(balances.filter(b => b.available));
                setTotalFiat(info.fiatEstimate);
                setIsLoading(false);
            })
            .catch(err => {
                console.error(err.response ? err.response.data : err.message)
                setNotification({ type: 'error', text: err.response ? err.response.data : err.message });
                setIsLoading(false);
            })
    }, [fiat, isFuture])

    function onOrderSubmit(order) {
        window.location.reload();
    }

    function onFiatChange(event) {
        setDefaultFiat(event.target.value);
        setFiat(event.target.value);
    }

    return (
        <React.Fragment>
            <Menu />
            <main className="content">
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                    <div className="d-block mb-4 mb-md-0">
                        <h2 className="h4">Wallet</h2>
                    </div>
                    <div className="btn-toolbar mb-2 mb-md-0">
                        {
                            localStorage.getItem("hasFutures") === "true"
                                ? (
                                    <div className='me-2'>
                                        <button className='btn btn-secondary me-2' onClick={() => setIsFuture(!isFuture)}>
                                            {
                                                isFuture
                                                    ? "Futures"
                                                    : "Spot"
                                            }
                                        </button>
                                    </div>
                                )
                                : <React.Fragment></React.Fragment>
                        }
                        <div className="me-2">
                            <SelectFiat onChange={onFiatChange} fiat={fiat} />
                        </div>
                        <NewOrderButton />
                    </div>
                </div>
                <div className="card card-body border-0 shadow table-wrapper table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th className="border-gray-200">Symbol</th>
                                <th className="border-gray-200">Available</th>
                                <th className="border-gray-200">Locked</th>
                                <th className="border-gray-200">Fiat Total</th>
                                <th className="border-gray-200">Avg Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                !isLoading && balances && balances.length
                                    ? balances.filter(b => parseFloat(b.available) > 0 || parseFloat(b.onOrder) > 0).map(item => (<WalletRow key={item.symbol} data={item} />))
                                    : (
                                        <tr>
                                            <td colSpan={5}>Loading...</td>
                                        </tr>
                                    )
                            }
                        </tbody>
                        <tfoot>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td>{totalFiat}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <Footer />
            </main>
            <NewOrderModal onSubmit={onOrderSubmit} />
            <Toast type={notification.type} text={notification.text} />
        </React.Fragment>
    );
}

export default Wallet;
