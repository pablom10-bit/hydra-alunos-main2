import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Menu from '../../components/Menu/Menu';
import Ticker from './Ticker/Ticker';
import Book from './Book/Book';
import useWebSocket from 'react-use-websocket';
import Wallet from '../../components/Wallet/Wallet';
import NewOrderButton from '../../components/NewOrder/NewOrderButton';
import NewOrderModal from '../../components/NewOrder/NewOrderModal';
import CandleChart from './CandleChart';
import SelectSymbol from '../../components/SelectSymbol';
import Footer from '../../components/Footer';
import Toast from '../../components/Toast';

function Dashboard() {

  const navigate = useNavigate();

  const [tickerState, setTickerState] = useState({});

  const [balanceState, setBalanceState] = useState({});

  const [bookState, setBookState] = useState({});

  const [wallet, setWallet] = useState({});

  const [chartSymbol, setChartSymbol] = useState('BTCUSDT');

  const [notification, setNotification] = useState({ type: '', text: '' });

  const { lastJsonMessage } = useWebSocket(process.env.REACT_APP_WS_URL, {
    onOpen: () => {
      console.log(`Connected to App WS`);
    },
    onMessage: () => {
      if (lastJsonMessage) {
        if (lastJsonMessage.ticker) setTickerState(lastJsonMessage.ticker);
        else if (lastJsonMessage.balance) {
          setBalanceState(lastJsonMessage.balance);
        }
        else if (lastJsonMessage.book) {
          lastJsonMessage.book.forEach(b => bookState[b.symbol] = b);
          setBookState(bookState);
        }
      }
    },
    queryParams: { 'token': localStorage.getItem("token") },
    onError: (event) => {
      console.error(event);
      setNotification({ type: 'error', text: event });
    },
    shouldReconnect: (closeEvent) => true,
    reconnectInterval: 3000
  });

  function onWalletUpdate(walletObj) {
    setWallet(walletObj);
  }

  function onSubmitOrder(order) {
    navigate('/orders/' + order.symbol);
  }

  function onChangeSymbol(event) {
    setChartSymbol(event.target.value);
  }

  return (
    <React.Fragment>
      <Menu />
      <main className="content">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
          <div className="d-block mb-4 mb-md-0">
            <h1 className="h4">Dashboard</h1>
          </div>
          <div className="btn-toolbar mb-md-0">
            <div className="d-inline-flex align-items-center">
              <SelectSymbol onChange={onChangeSymbol} symbol={chartSymbol} />
            </div>
            <div className="ms-2 ms-lg-3">
              <NewOrderButton />
            </div>
          </div>
        </div>
        <CandleChart symbol={chartSymbol} />
        <div className="row">
          <div className="col-12">
            <Ticker data={tickerState} />
          </div>
        </div>
        <div className="row">
          <Book data={bookState} />
          <Wallet data={balanceState} onUpdate={onWalletUpdate} />
        </div>
        <Footer />
      </main>
      <NewOrderModal wallet={wallet} onSubmit={onSubmitOrder} />
      <Toast type={notification.type} text={notification.text} />
    </React.Fragment>
  );
}

export default Dashboard;
