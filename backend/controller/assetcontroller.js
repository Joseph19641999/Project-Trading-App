const express = require('express');
const router = express.Router();

const { extractStockDataforFrontend } = require("../service/DataProvider/AssetDataExtracting");

const FeatureFlagService = require('../service/featureFlag');
const AssetService = require('../service/AssetService');

const assetService = new AssetService();
const featureFlags = new FeatureFlagService();



router.get('/assets/historical/:name', async (req, res) => {
    try {
        const symbol = req.params.name;

        if (!symbol) {
            return res.status(400).json({ error: 'Symbol parameter is missing' });
        }
        
        const data = await assetService.getHistoricalData(symbol);
        res.status(201).json(data);
        featureFlags.log('info', `Retrieved historical stock data for symbol ${symbol}`);

    } catch (error) {
        const symbol = req.params.name;
        featureFlags.log('error', `Failed to retrieve historical stock data for symbol ${symbol}: ${error.message}`);
        res.status(500).send('An error occurred while fetching historical stock data');
    }
});


router.get('/assets/most-active', async (req, res) => {    
    try {
        const stockData = await assetService.getMostActiveAssetsFromTable();
        res.status(201).json(stockData);
        featureFlags.log('info', 'Retrieved most active assets data');

    } catch (error) {
        featureFlags.log('error', `Error fetching most active assets data: ${error.message}`);
        res.status(500).send('An error occurred while fetching most active assets data');
    }
});


router.get('/assets/showcase', async (req, res) => {    
    try {
        const stockData = await assetService.getShowcaseFromTable();
        res.status(201).json(stockData);
        featureFlags.log('info', 'Retrieved Showcase data');

    } catch (error) {
        featureFlags.log('error', `Error fetching Showcase data: ${error.message}`);
        res.status(500).send('An error occurred while fetching Showcase data');
    }
});


router.get('/assets/Fundamentals/:name', extractStockDataforFrontend);


module.exports = router;
