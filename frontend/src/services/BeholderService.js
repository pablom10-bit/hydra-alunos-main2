import axios from './BaseService';

const BEHOLDER_URL = `${process.env.REACT_APP_API_URL}/beholder/`;

export async function getIndexes() {
    const response = await axios.get(BEHOLDER_URL + 'memory/indexes');
    return response.data;
}

export async function getAnalysisIndexes() {
    const response = await axios.get(`${BEHOLDER_URL}analysis/`);
    return response.data;
}

export async function getMemoryIndex(symbol, index, interval) {
    const response = await axios.get(`${BEHOLDER_URL}memory/${symbol}/${index}/${interval ? interval : ''}`);
    return response.data;
}

export async function getMemory() {
    const response = await axios.get(`${BEHOLDER_URL}memory/`);
    return response.data;
}

export async function getAgenda() {
    const response = await axios.get(`${BEHOLDER_URL}agenda/`);
    return response.data;
}

export async function getBrain() {
    const response = await axios.get(`${BEHOLDER_URL}brain/`);
    return response.data;
}

export function getDefaultIndexes(symbol) {
    return [{
        variable: 'BOOK.bestAsk',
        symbol,
        eval: `MEMORY['${symbol}:BOOK'].current.bestAsk`,
        example: 0
    }, {
        variable: 'BOOK.bestBid',
        symbol,
        eval: `MEMORY['${symbol}:BOOK'].current.bestBid`,
        example: 0
    }, {
        variable: 'TICKER.averagePrice',
        symbol,
        eval: `MEMORY['${symbol}:TICKER'].current.averagePrice`,
        example: 0
    }, {
        variable: 'TICKER.bestAsk',
        symbol,
        eval: `MEMORY['${symbol}:TICKER'].current.bestAsk`,
        example: 0
    }, {
        variable: 'TICKER.bestBid',
        symbol,
        eval: `MEMORY['${symbol}:TICKER'].current.bestBid`,
        example: 0
    }, {
        variable: 'TICKER.bestAskQty',
        symbol,
        eval: `MEMORY['${symbol}:TICKER'].current.bestAskQty`,
        example: 0
    }, {
        variable: 'TICKER.bestBidQty',
        symbol,
        eval: `MEMORY['${symbol}:TICKER'].current.bestBidQty`,
        example: 0
    }, {
        variable: 'TICKER.close',
        symbol,
        eval: `MEMORY['${symbol}:TICKER'].current.close`,
        example: 0
    }, {
        variable: 'TICKER.open',
        symbol,
        eval: `MEMORY['${symbol}:TICKER'].current.open`,
        example: 0
    }, {
        variable: 'TICKER.low',
        symbol,
        eval: `MEMORY['${symbol}:TICKER'].current.low`,
        example: 0
    }, {
        variable: 'TICKER.high',
        symbol,
        eval: `MEMORY['${symbol}:TICKER'].current.high`,
        example: 0
    }, {
        variable: 'TICKER.closeQty',
        symbol,
        eval: `MEMORY['${symbol}:TICKER'].current.closeQty`,
        example: 0
    }, {
        variable: 'TICKER.percentChange',
        symbol,
        eval: `MEMORY['${symbol}:TICKER'].current.percentChange`,
        example: 0
    }, {
        variable: 'TICKER.prevClose',
        symbol,
        eval: `MEMORY['${symbol}:TICKER'].current.prevClose`,
        example: 0
    }, {
        variable: 'TICKER.priceChange',
        symbol,
        eval: `MEMORY['${symbol}:TICKER'].current.priceChange`,
        example: 0
    }, {
        variable: 'TICKER.quoteVolume',
        symbol,
        eval: `MEMORY['${symbol}:TICKER'].current.quoteVolume`,
        example: 0
    }, {
        variable: 'TICKER.volume',
        symbol,
        eval: `MEMORY['${symbol}:TICKER'].current.volume`,
        example: 0
    }]
}

export function getFuturesLastOrderIndexes(symbol) {
    const userId = localStorage.getItem("id");
    if (!/^(.+(USDT|BUSD))$/.test(symbol)) return [];

    return [{
        variable: `FLAST_ORDER_${userId}.activatePrice`,
        symbol,
        eval: `MEMORY['${symbol}:FLAST_ORDER_${userId}'].activatePrice`,
        example: 123
    }, {
        variable: `FLAST_ORDER_${userId}.avgPrice`,
        symbol,
        eval: `MEMORY['${symbol}:FLAST_ORDER_${userId}'].avgPrice`,
        example: 123
    }, {
        variable: `FLAST_ORDER_${userId}.limitPrice`,
        symbol,
        eval: `MEMORY['${symbol}:FLAST_ORDER_${userId}'].limitPrice`,
        example: 123
    }, {
        variable: `FLAST_ORDER_${userId}.net`,
        symbol,
        eval: `MEMORY['${symbol}:FLAST_ORDER_${userId}'].net`,
        example: 123
    }, {
        variable: `FLAST_ORDER_${userId}.positionSide`,
        symbol,
        eval: `MEMORY['${symbol}:FLAST_ORDER_${userId}'].positionSide`,
        example: "BOTH"
    }, {
        variable: `FLAST_ORDER_${userId}.priceRate`,
        symbol,
        eval: `MEMORY['${symbol}:FLAST_ORDER_${userId}'].priceRate`,
        example: 1
    }, {
        variable: `FLAST_ORDER_${userId}.quantity`,
        symbol,
        eval: `MEMORY['${symbol}:FLAST_ORDER_${userId}'].quantity`,
        example: 0.1
    }, {
        variable: `FLAST_ORDER_${userId}.closePosition`,
        symbol,
        eval: `MEMORY['${symbol}:FLAST_ORDER_${userId}'].closePosition`,
        example: false
    }, {
        variable: `FLAST_ORDER_${userId}.reduceOnly`,
        symbol,
        eval: `MEMORY['${symbol}:FLAST_ORDER_${userId}'].reduceOnly`,
        example: false
    }, {
        variable: `FLAST_ORDER_${userId}.side`,
        symbol,
        eval: `MEMORY['${symbol}:FLAST_ORDER_${userId}'].side`,
        example: "BUY"
    }, {
        variable: `FLAST_ORDER_${userId}.status`,
        symbol,
        eval: `MEMORY['${symbol}:FLAST_ORDER_${userId}'].status`,
        example: "FILLED"
    }, {
        variable: `FLAST_ORDER_${userId}.type`,
        symbol,
        eval: `MEMORY['${symbol}:FLAST_ORDER_${userId}'].type`,
        example: "MARKET"
    }, {
        variable: `FLAST_ORDER_${userId}.stopPrice`,
        symbol,
        eval: `MEMORY['${symbol}:FLAST_ORDER_${userId}'].stopPrice`,
        example: 123
    }]
}

export function getLastOrderIndexes(symbol) {
    const userId = localStorage.getItem("id");

    return [{
        variable: `LAST_ORDER_${userId}.activatePrice`,
        symbol,
        eval: `MEMORY['${symbol}:LAST_ORDER_${userId}'].activatePrice`,
        example: 123
    }, {
        variable: `LAST_ORDER_${userId}.avgPrice`,
        symbol,
        eval: `MEMORY['${symbol}:LAST_ORDER_${userId}'].avgPrice`,
        example: 123
    }, {
        variable: `LAST_ORDER_${userId}.limitPrice`,
        symbol,
        eval: `MEMORY['${symbol}:LAST_ORDER_${userId}'].limitPrice`,
        example: 123
    }, {
        variable: `LAST_ORDER_${userId}.net`,
        symbol,
        eval: `MEMORY['${symbol}:LAST_ORDER_${userId}'].net`,
        example: 123
    }, {
        variable: `LAST_ORDER_${userId}.quantity`,
        symbol,
        eval: `MEMORY['${symbol}:LAST_ORDER_${userId}'].quantity`,
        example: 0.1
    }, {
        variable: `LAST_ORDER_${userId}.side`,
        symbol,
        eval: `MEMORY['${symbol}:LAST_ORDER_${userId}'].side`,
        example: "BUY"
    }, {
        variable: `LAST_ORDER_${userId}.status`,
        symbol,
        eval: `MEMORY['${symbol}:LAST_ORDER_${userId}'].status`,
        example: "FILLED"
    }, {
        variable: `LAST_ORDER_${userId}.type`,
        symbol,
        eval: `MEMORY['${symbol}:LAST_ORDER_${userId}'].type`,
        example: "MARKET"
    }, {
        variable: `LAST_ORDER_${userId}.stopPrice`,
        symbol,
        eval: `MEMORY['${symbol}:LAST_ORDER_${userId}'].stopPrice`,
        example: 123
    }]
}

export function getFuturesLiquidationIndexes(symbol) {
    if (!/^(.+(USDT|BUSD))$/.test(symbol)) return [];

    return [{
        variable: `LAST_LIQ.side`,
        symbol,
        eval: `MEMORY['${symbol}:LAST_LIQ'].side`,
        example: "BUY"
    }, {
        variable: `LAST_LIQ.orderType`,
        symbol,
        eval: `MEMORY['${symbol}:LAST_LIQ'].orderType`,
        example: "MARKET"
    }, {
        variable: `LAST_LIQ.timeInForce`,
        symbol,
        eval: `MEMORY['${symbol}:LAST_LIQ'].timeInForce`,
        example: "GTC"
    }, {
        variable: `LAST_LIQ.origAmount`,
        symbol,
        eval: `MEMORY['${symbol}:LAST_LIQ'].origAmount`,
        example: 123
    }, {
        variable: `LAST_LIQ.price`,
        symbol,
        eval: `MEMORY['${symbol}:LAST_LIQ'].price`,
        example: 123
    }, {
        variable: `LAST_LIQ.avgPrice`,
        symbol,
        eval: `MEMORY['${symbol}:LAST_LIQ'].avgPrice`,
        example: 123
    }, {
        variable: `LAST_LIQ.orderStatus`,
        symbol,
        eval: `MEMORY['${symbol}:LAST_LIQ'].orderStatus`,
        example: 'FILLED'
    }, {
        variable: `LAST_LIQ.totalFilledQty`,
        symbol,
        eval: `MEMORY['${symbol}:LAST_LIQ'].totalFilledQty`,
        example: 123
    }]
}