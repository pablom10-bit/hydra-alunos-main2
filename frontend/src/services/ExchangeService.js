import axios from './BaseService';
import { getDefaultFiat } from '../components/SelectFiat';

const EXCHANGE_URL = `${process.env.REACT_APP_API_URL}/exchange/`;

export const STOP_TYPES = ["STOP", "STOP_MARKET", "TAKE_PROFIT_MARKET", "STOP_LOSS", "STOP_LOSS_LIMIT", "TAKE_PROFIT", "TAKE_PROFIT_LIMIT"];

export const LIMIT_TYPES = ["LIMIT", "STOP", "TAKE_PROFIT", "STOP_LOSS_LIMIT", "TAKE_PROFIT_LIMIT"];

export const MARKET_TYPES = ["MARKET", "STOP_MARKET", "TAKE_PROFIT_MARKET", "TRAILING_STOP_MARKET"];

export const FINISHED_STATUS = ["FILLED", "REJECTED", "CANCELED", "EXPIRED", "NEW_INSURANCE", "NEW_ADL"];

export async function getBalance(isFuture = false) {
    const query = isFuture ? "?isFuture=true" : "";
    const response = await axios.get(`${EXCHANGE_URL}balance/${getDefaultFiat()}${query}`);
    return response.data;
}

export async function getFullBalance(fiat, isFuture = false) {
    const query = isFuture ? "?isFuture=true" : "";
    const response = await axios.get(`${EXCHANGE_URL}balance/full/${fiat}${query}`);
    return response.data;
}

export async function getCoins() {
    const response = await axios.get(EXCHANGE_URL + 'coins');
    return response.data;
}

export async function doWithdraw(withdrawTemplateId) {
    const response = await axios.post(`${EXCHANGE_URL}withdraw/${withdrawTemplateId}`, null);
    return response.data;
}

export async function getFuturesPositions(symbol = '') {
    const response = await axios.get(`${EXCHANGE_URL}futures/${symbol}`);
    return response.data;
}

export async function closeFuturesPosition(symbol) {
    const response = await axios.delete(`${EXCHANGE_URL}futures/${symbol}`);
    return response.data;
}

export async function closeAllFuturesPositions() {
    const response = await axios.delete(`${EXCHANGE_URL}futures/all`);
    return response.data;
}

export async function updateFuturesPosition(symbol, params) {
    const response = await axios.patch(`${EXCHANGE_URL}futures/${symbol}`, params);
    return response.data;
}
