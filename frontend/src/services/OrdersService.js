import axios from './BaseService';

const ORDERS_URL = `${process.env.REACT_APP_API_URL}/orders/`;
const { STOP_TYPES, LIMIT_TYPES } = require('./ExchangeService');

export async function getOrders(symbol, page = 1, isFuture = false) {
    const ordersUrl = `${ORDERS_URL}${symbol}?page=${page}&isFuture=${isFuture}`;
    const response = await axios.get(ordersUrl);
    return response.data;//{count, rows}
}

export async function cancelOrder(symbol, orderId, isFuture = false) {
    const response = await axios.delete(`${ORDERS_URL}${symbol}/${orderId}?isFuture=${isFuture}`);
    return response.data;
}

export async function syncOrder(beholderOrderId, isFuture = false) {
    const response = await axios.post(`${ORDERS_URL}${beholderOrderId}/sync?isFuture=${isFuture}`, null);
    return response.data;
}

export async function placeOrder(order, isFuture = false) {
    const postOrder = {
        symbol: order.symbol.toUpperCase(),
        quantity: order.quantity,
        side: order.side.toUpperCase(),
        options: {
            type: order.type.toUpperCase()
        }
    }

    if (postOrder.options.type === 'MARKET' && order.isQuote) {
        postOrder.options.quoteOrderQty = order.quantity;
        delete postOrder.quantity;
    }

    if ([...LIMIT_TYPES, 'TRAILING_STOP'].includes(postOrder.options.type))
        postOrder.limitPrice = order.limitPrice;

    if (STOP_TYPES.includes(postOrder.options.type))
        postOrder.options.stopPrice = order.stopPrice;

    if (postOrder.options.type === 'TRAILING_STOP')//trailing stop de spot
        postOrder.options.stopPriceMultiplier = order.stopPriceMultiplier;

    if (postOrder.options.type === 'TRAILING_STOP_MARKET') {//trailing stop de futuros
        postOrder.options.activationPrice = order.activationPrice;
        postOrder.options.callbackRate = order.callbackRate;
    }

    if (order.reduceOnly)
        postOrder.options.reduceOnly = order.reduceOnly;

    const response = await axios.post(`${ORDERS_URL}?isFuture=${isFuture}`, postOrder);
    return response.data;
}

function thirtyDaysAgo() {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    date.setHours(0, 0, 0, 0);
    return date.getTime();
}

function getStartToday() {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    return date.getTime();
}

function getToday() {
    const date = new Date();
    date.setHours(23, 59, 59, 999);
    return date.getTime();
}

export async function getOrdersReport(symbol, startDate, endDate, isFuture = false) {
    startDate = startDate ? startDate.getTime() : thirtyDaysAgo();
    endDate = endDate ? endDate.getTime() : getToday();

    const reportUrl = `${ORDERS_URL}reports/${symbol}?startDate=${startDate}&endDate=${endDate}&isFuture=${isFuture}`;
    const response = await axios.get(reportUrl);
    return response.data;
}

export async function getDayTradeReport(symbol, date, isFuture = false) {
    date = date ? date.getTime() : getStartToday();

    const reportUrl = `${ORDERS_URL}reports/${symbol}?date=${date}&isFuture=${isFuture}`;
    const response = await axios.get(reportUrl);
    return response.data;
}
