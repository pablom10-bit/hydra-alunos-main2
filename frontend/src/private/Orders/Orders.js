import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Menu from '../../components/Menu/Menu';
import Footer from '../../components/Footer';
import SearchSymbol from '../../components/SearchSymbol';
import NewOrderButton from '../../components/NewOrder/NewOrderButton';
import NewOrderModal from '../../components/NewOrder/NewOrderModal';
import OrderRow from './OrderRow';
import { getOrders } from '../../services/OrdersService';
import Pagination from '../../components/Pagination';
import ViewOrderModal from './ViewOrderModal';
import Toast from '../../components/Toast';
import PositionsTable from '../Futures/PositionsTable';

function Orders() {

    const defaultLocation = useLocation();

    function getPage(location) {
        if (!location) location = defaultLocation;
        return new URLSearchParams(location.search).get('page');
    }

    const navigate = useNavigate();

    useEffect(() => {
        setPage(getPage(defaultLocation));
    }, [defaultLocation])

    const { symbol } = useParams();

    const [search, setSearch] = useState(symbol ? symbol : '');

    const [orders, setOrders] = useState([]);

    const [notification, setNotification] = useState([]);

    const [count, setCount] = useState(0);

    const [viewOrder, setViewOrder] = useState({});

    const [page, setPage] = useState(getPage());

    const [isLoading, setIsLoading] = useState(false);

    const [refresh, setRefresh] = useState(0);

    function showFutures() {
        return window.location.href.indexOf('forders') !== -1;
    }

    useEffect(() => {
        setIsLoading(true);
        getOrders(search, page || 1, showFutures())
            .then(result => {
                setOrders(result.rows);
                setCount(result.count);
                setViewOrder(result.rows[0]);
                setIsLoading(false);
            })
            .catch(err => {
                console.error(err.response ? err.response.data : err.message);
                setNotification({ type: 'error', text: err.response ? err.response.data : err.message });
                setIsLoading(false);
            })

    }, [search, page, refresh])

    function onSearchChange(event) {
        setSearch(event.target.value);
    }

    function onViewClick(event) {
        const id = event.target.id.replace('view', '');
        const order = orders.find(o => o.id == id);
        // eslint-disable-next-line
        setViewOrder({ ...order });
    }

    function onOrderSubmit(order) {
        setRefresh(Date.now());
    }

    function toggleMarket() {
        if (showFutures())
            navigate('/orders/');
        else
            navigate('/forders/');
        setRefresh(Date.now());
    }

    return (
        <React.Fragment>
            <Menu />
            <main className="content">
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                    <div className="d-block mb-4 mb-md-0">
                        <h2 className="h4">{showFutures() ? "Futures " : "Spot "}Orders</h2>
                    </div>
                    <div className="btn-toolbar mb-2 mb-md-0">
                        {
                            localStorage.getItem("hasFutures") === "true"
                                ? (
                                    <div className='me-2 mb-3'>
                                        <button className='btn btn-secondary me-2' onClick={toggleMarket}>
                                            {
                                                showFutures()
                                                    ? "Futures"
                                                    : "Spot"
                                            }
                                        </button>
                                    </div>
                                )
                                : <React.Fragment></React.Fragment>
                        }
                        <div className="d-inline-flex align-items-center me-2 mb-3">
                            <NewOrderButton />
                        </div>
                        <div className="btn-group">
                            <SearchSymbol onChange={onSearchChange} placeholder={search} />
                        </div>
                    </div>
                </div>
                <div className="card card-body border-0 shadow table-wrapper table-responsive">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th className="border-gray-200">Order</th>
                                <th className="border-gray-200">Date</th>
                                <th className="border-gray-200">Qty</th>
                                <th className="border-gray-200">Net</th>
                                <th className="border-gray-200">Status</th>
                                <th className="border-gray-200">View</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                !isLoading && orders && orders.length
                                    ? orders.map(order => (<OrderRow key={order.clientOrderId} data={order} onClick={onViewClick} />))
                                    : <tr><td colSpan={6}>Loading...</td></tr>
                            }
                        </tbody>
                    </table>
                    <Pagination count={count} />
                </div>
                {
                    showFutures()
                        ? <PositionsTable />
                        : <React.Fragment></React.Fragment>
                }
                <Footer />
            </main>
            <ViewOrderModal data={viewOrder} onUpdate={onOrderSubmit} />
            <NewOrderModal onSubmit={onOrderSubmit} />
            <Toast type={notification.type} text={notification.text} />
        </React.Fragment>
    );
}

export default Orders;
