const express = require('express');
const router = express.Router();
const TransactionService = require("../service/TransactionService");

const transactionService = new TransactionService();

const FeatureFlagService = require('../service/featureFlag');
const featureFlags = new FeatureFlagService();




router.get('/user/:userid/transactions/purchase', async (req, res) => {
    try {
        const userId = req.params.userid;
        if (!userId) {
            return res.status(400).send('User ID is required');
        }
        await transactionService.getUserKaufTransactions(req, res);
    } catch (error) {
        res.status(500).send('Failed to fetch purchase transactions');
        featureFlags.log('error', `Failed to fetch purchase transactions for user ${req.params.userid}: ${error.message}`);
    }
});

router.get('/user/:userid/transactions/sale', async (req, res) => {
    try {
        const userId = req.params.userid;
        if (!userId) {
            return res.status(400).send('User ID is required');
        }
        await transactionService.getUserVerkaufTransactions(req, res);
    } catch (error) {
        res.status(500).send('Failed to fetch sale transactions');
        featureFlags.log('error', `Failed to fetch sale transactions for user ${req.params.userid}: ${error.message}`);
    }
});






router.post('/purchase', async (req, res) => {
    try {
        const purchaseData = req.body;
        if (!purchaseData) {
            return res.status(400).send('Purchase data is required');
        }
        const response = await transactionService.processPurchase(purchaseData);
        res.json({
            status: 'success',
            message: 'Purchase processed successfully',
            transaction: response.newTransaction,
            portfolio: response.newPortfolio
        });
        featureFlags.log('info', `Processed purchase transaction: ${response.newTransaction}`);
    } catch (error) {
        res.status(500).send('Purchase process failed.');
        featureFlags.log('error', `Failed to process purchase transaction: ${error.message}`);
    }
});

router.post('/sale', async (req, res) => {
    try {
        const sellingData = req.body;
        if (!sellingData) {
            return res.status(400).send('Selling data is required');
        }
        const response = await transactionService.processSale(sellingData);
        res.json({
            status: 'success',
            message: 'Sale processed successfully',
            transaction: response.newTransaction,
            portfolio: response.newPortfolio
        });
        featureFlags.log('info', `Processed sale transaction: ${response.newTransaction}`);
    } catch (error) {
        res.status(500).send('Sale process failed.');
        featureFlags.log('error', `Failed to process sale transaction: ${error.message}`);
    }
});





router.get('/transaction/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).send('Transaction ID is required');
        }
        console.log('Finding transaction by ID:', id);
        const transaction = await transactionService.getTransactionById(id);
        res.json({
            status: 'success',
            message: 'Transaction found successfully',
            transaction: transaction
        });
        featureFlags.log('info', `Retrieved transaction details for ID: ${id}`);
    } catch (error) {
        res.status(500).send('Error finding transaction.');
        featureFlags.log('error', `Failed to retrieve transaction details for ID: ${req.params.id}: ${error.message}`);
    }
});

module.exports = router;
