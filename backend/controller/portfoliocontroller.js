const Router = require('express');
const router = Router();
const PortfolioService = require("../service/PortfolioService");
const portfolioService = new PortfolioService();

const FeatureFlagService = require('../service/featureFlag');
const featureFlags = new FeatureFlagService();

router.get('/user/:userid/portfolios', async (req, res) => {
    await portfolioService.getUserPortfolios(req, res);
});

router.get('/user/:userid/portfolios/stock', async (req, res) => {
    await portfolioService.getUserPortfoliosStock(req, res);
});

router.get('/user/:userid/portfolios/fund', async (req, res) => {
    await portfolioService.getUserPortfoliosFund(req, res);
});

router.get('/user/:userid/portfolios/historical/stock', async (req, res) => {
    await portfolioService.getUserPortfolioHistoricalDataStock(req, res);
});

router.get('/user/:userid/portfolios/historical/fund', async (req, res) => {
    await portfolioService.getUserPortfolioHistoricalDataFund(req, res);
});

router.get('/user/:userid/portfolios/Rendite/stock', async (req, res) => {
    await portfolioService.getstockportfolioGewin_gesamtwertStock(req, res);
});

router.get('/user/:userid/portfolios/Rendite/fund', async (req, res) => {
    await portfolioService.getstockportfolioGewin_gesamtwertFund(req, res);
});



router.get('/user/:id/portfolios', async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: 'User ID parameter is missing' });
        }

        featureFlags.log('debug', `Fetching portfolios for user ID: ${id}`);

        const portfolios = await portfolioService.findPortfolioEntriesByUserId(id);

        if (!portfolios) {
            return res.status(404).send('No portfolios found for this user');
        }
        res.status(201).json(portfolios);

    } catch (error) {
        res.status(500).send('An error occurred while fetching user portfolios');
        featureFlags.log('error', `Failed to retrieve portfolio details for User ID: ${req.params.id}: ${error.message}`);

    }
});



module.exports = router;
