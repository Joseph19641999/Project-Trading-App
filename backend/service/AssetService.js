const fetch = require('node-fetch');
const AssetRepository = require('../Database/repository/asset_repository');
const FeatureFlagService = require('./featureFlag');
const { extractStockDataforDatabase } = require('./DataProvider/AssetDataExtracting');

const API_TOKEN = 'toUYRwfs9fxQWkUDcEV8cTlEgnkMOkPT';
const featureFlagService = new FeatureFlagService();

class AssetService {
    constructor() {
        this.assetRepository = new AssetRepository();
    }



    async getHistoricalData(symbol) {
        try {
            if (!symbol) {
                featureFlagService.log('error', 'Invalid symbol for historical data request:', symbol);
                throw new Error('Invalid symbol for historical data request');
            }

            const url = `https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?apikey=${API_TOKEN}`;

            const response = await fetch(url, { headers: { 'User-Agent': 'request' } });
            if (!response.ok) {
                featureFlagService.log('error', `Failed to fetch historical data for symbol: ${symbol}`);
                return null;
            }
            return await response.json();

        } catch (error) {
            featureFlagService.log('error', `Error fetching historical data for symbol: ${symbol}`, error);
            return null;
        }
    }






    async getMostActiveStocks() {
        const url = `https://financialmodelingprep.com/api/v3/stock_market/actives?apikey=${API_TOKEN}`;
        try {
            const response = await fetch(url, { headers: { 'User-Agent': 'request' } });
            if (!response.ok) {
                featureFlagService.log('error', 'Failed to fetch most active stocks');
                return null;
            }

            const data = await response.json();
            const symbols = data.filter(item => item != null).map(item => item.symbol);

            return symbols;

        } catch (error) {
            featureFlagService.log('error', 'Error fetching most active stocks', error);
            return null;
        }
    }

    async addMostActiveAssets(data) {
        try {
            if (!data || data.length === 0) {
                throw new Error('Valid Data is required to add assets.');
            }

            await this.updateAssetTable(data);

        } catch (error){
            featureFlagService.log('error', 'Error adding most active asset:', error);
            return null;
        }
    }

    async getMostActiveAssetsFromTable() {
        try{
            featureFlagService.log('info', 'Fetching Most Active Assets.');

            const data = await this.getMostActiveStocks();
            if (!data || data.length === 0) {
                featureFlagService.log('info', 'No Most active assets received.');
                return [];
            }

            const assets = [];
            for (const item of data) {
                const asset = await this.assetRepository.findBySymbol(item);
                if (asset) {
                    assets.push(asset);
                } else {
                    await this.addMostActiveAssets([item]);
                }
            }

            return assets;

        } catch (error){
            featureFlagService.log('error', 'Error fetching most acting from table:', error);
            return null;
        }
    }






    async getShowcaseFromTable() {
        try {
            featureFlagService.log('info', 'Fetching Showcase Assets..');

            const data = await this.getShowcase();
            if (!data || data.length === 0) {
                featureFlagService.log('info', 'No Showcase assets received.');
                return [];
            }

            const assets = [];
            for (const item of data) {
                const asset = await this.assetRepository.findBySymbol(item);
                if (asset) {
                    assets.push(asset);
                } else {
                    continue;
                }
            }

            return assets;

        } catch (error){
            featureFlagService.log('error', 'Error fetching showcase:', error);
            return null;
        }
    }

    async getShowcase(){
        const showcase = ['NVDA', 'AAPL', 'INTC', 'CCEP'];
        return showcase
    }






    async updateAssetTable(symbols) {
        try {
            if (!Array.isArray(symbols)) {
                throw new Error('Invalid input: symbols must be an array.');
            }

            featureFlagService.log('info', 'Updating asset table.');

            const assetData = await extractStockDataforDatabase(symbols);
            const promises = assetData.map(async item => {
                try {
                    const existingAsset = await this.assetRepository.findBySymbol(item.symbol);

                    if (existingAsset) {
                        featureFlagService.log('info', `Updating asset with symbol: ${item.symbol}`);
                        await this.assetRepository.update(item);
                    } else {
                        featureFlagService.log('info', `Adding new asset with symbol: ${item.symbol}`);
                        await this.assetRepository.create(item);
                    }
                    
                } catch (error) {
                    featureFlagService.log('error', `Error processing asset with symbol ${item.symbol}:`, error);
                    return null;
                }
            });

            await Promise.all(promises);
            featureFlagService.log('info', 'All assets processed successfully');

        } catch (error){
            featureFlagService.log('error', 'Error updating asset:', error);
            return null;
        }
    }


    async addAsset(symbol) {
        try {
            if (!symbol) {
                throw new Error('Symbol is required to add asset.');
            }

            const assetData = await extractStockDataforDatabase([symbol]);
            await this.assetRepository.save(assetData);
            featureFlagService.log('info', `Asset added successfully: ${symbol}`);

        } catch (error) {
            featureFlagService.log('error', 'Error adding new asset:', error);
            return null;
        }
    }
}




module.exports = AssetService;
