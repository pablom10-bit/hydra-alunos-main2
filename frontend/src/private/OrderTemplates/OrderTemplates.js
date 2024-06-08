import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Menu from '../../components/Menu/Menu';
import Footer from '../../components/Footer';
import SearchSymbol from '../../components/SearchSymbol';
import NewOrderTemplateButton from './NewOrderTemplateButton';
import OrderTemplateRow from './OrderTemplateRow';
import { getOrderTemplates, deleteOrderTemplate } from '../../services/OrderTemplatesService';
import Pagination from '../../components/Pagination';
import Toast from '../../components/Toast';

function OrderTemplates() {

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
    const [refresh, setRefresh] = useState(0);
    const [orderTemplates, setOrderTemplates] = useState([]);

    const [notification, setNotification] = useState([]);

    const [count, setCount] = useState(0);

    const [page, setPage] = useState(getPage());

    useEffect(() => {
        getOrderTemplates(search, page || 1, showFutures())
            .then(result => {
                setOrderTemplates(result.rows ? result.rows : []);
                setCount(result.count);
            })
            .catch(err => {
                console.error(err.response ? err.response.data : err.message);
                setNotification({ type: 'error', text: err.response ? err.response.data : err.message });
            })

    }, [search, page, refresh])

    function onSearchChange(event) {
        setSearch(event.target.value);
    }

    function onDeleteClick(event) {
        const id = event.target.id.replace('delete', '');
        deleteOrderTemplate(id)
            .then(template => { window.location.reload() })
            .catch(err => {
                console.error(err.response ? err.response.data : err.message)
                setNotification({ type: 'error', text: err.response ? err.response.data : err.message });
            });
    }

    function showFutures() {
        return window.location.href.indexOf('fOrderTemplates') !== -1;
    }

    function toggleMarket() {
        if (showFutures())
            navigate('/orderTemplates/');
        else
            navigate('/fOrderTemplates/');
        setRefresh(Date.now());
    }

    return (
        <React.Fragment>
            <Menu />
            <main className="content">
                <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
                    <div className="d-block mb-4 mb-md-0">
                        <h2 className="h4">{showFutures() ? "Futures " : "Spot "}Order Templates</h2>
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
                            <NewOrderTemplateButton />
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
                                <th className="border-gray-200">Symbol</th>
                                <th className="border-gray-200">Name</th>
                                <th className="border-gray-200">Side</th>
                                <th className="border-gray-200">Type</th>
                                <th className="border-gray-200">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                orderTemplates && orderTemplates.length
                                    ? orderTemplates.map(ot => (<OrderTemplateRow key={ot.id} data={ot} onDeleteClick={onDeleteClick} />))
                                    : <React.Fragment></React.Fragment>
                            }
                        </tbody>
                    </table>
                    <Pagination count={count} />
                </div>
                <Footer />
            </main>
            <Toast type={notification.type} text={notification.text} />
        </React.Fragment>
    );
}

export default OrderTemplates;
