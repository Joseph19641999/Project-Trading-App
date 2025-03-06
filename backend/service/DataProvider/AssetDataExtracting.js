const fetch = require('node-fetch');
const FeatureFlagService = require("../featureFlag");

const featureFlagService = new FeatureFlagService();
const API_TOKEN = "toUYRwfs9fxQWkUDcEV8cTlEgnkMOkPT";



async function fetchStockData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch data from ${url}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        featureFlagService.log('error', `Failed to fetch data from ${url}: ${error.message}`);
        return null;
    }
}



async function fetchStockDataForSymbols(symbols) {
    const urls = symbols.map(symbol => `https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${API_TOKEN}`);
    try {
        const data = await Promise.all(urls.map(url => fetchStockData(url)));
        return symbols.map((symbol, index) => {
            const stockData = data[index][0];
            if (!stockData) {
                featureFlagService.log('error', `No data found for symbol ${symbol}`);
                return null;
            }
            return {
                symbol: stockData.symbol || symbol,
                price: stockData.price || 0,
                beta: stockData.beta || 0,
                volAvg: stockData.volAvg || 0,
                mktCap: stockData.mktCap || 0,
                lastDiv: stockData.lastDiv || 0,
                range: stockData.range || 'Unknown',
                changes: stockData.changes || 0,
                exchangeShortName: stockData.exchangeShortName || 'Unknown',
                companyName: stockData.companyName || 'Unknown',
                currency: stockData.currency || 'Unknown',
                isin: stockData.isin || 'Unknown',
                exchange: stockData.exchange || 'Unknown',
                website: stockData.website || 'Unknown',
                description: stockData.description || 'Unknown',
                ceo: stockData.ceo || 'Unknown',
                sector: stockData.sector || 'Unknown',
                country: stockData.country || 'Unknown',
                fullTimeEmployees: stockData.fullTimeEmployees || 'Unknown',
                city: stockData.city || 'Unknown',
                image: stockData.image || 'Unknown',
                isFund: stockData.isFund || false,
            };
        });
    } catch (error) {
        featureFlagService.log('error', 'Error fetching data for symbols:', error);
        return [];
    }
}





async function extractStockDataforDatabase(symbols) {
    try {
        if (!Array.isArray(symbols) || symbols.length === 0) {
            throw new Error('Symbols array is required for fetching stock data.');
        }

        const stockData = await fetchStockDataForSymbols(symbols);
        return stockData.filter(data => data);
        
    } catch (error) {
        featureFlagService.log('error', 'Error compiling data for database:', error);
        return [];
    }
}




async function extractStockDataforFrontend(req, res) {
    let symbols = req.query.symbols ? req.query.symbols.split(',') : [];
    const symbol = req.params.name;

    if (symbols.length === 0 && !symbol) {
        return res.status(400).send('No symbols provided');
    }

    if (symbols.length === 0 && symbol) {
        symbols = [symbol];
    }

    try {
        const stockData = await fetchStockDataForSymbols(symbols);
        if (stockData.some(data => !data)) {
            res.status(500).send('Some data could not be fetched');
            return;
        }
        res.send(stockData);
    } catch (error) {
        featureFlagService.log('error', 'Error fetching stock data for frontend:', error.message);
        res.status(500).send('An error occurred while fetching data');
    }
}



module.exports = { extractStockDataforDatabase, extractStockDataforFrontend };
