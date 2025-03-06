const TransactionRepository = require("../Database/repository/Transaction_repository");
const UserService = require("./UserService");
const PortfolioService = require("./PortfolioService");
const FeatureFlagService = require('./featureFlag');
const featureFlagService = new FeatureFlagService();

class TransactionService {
    constructor() {
        this.transactionRepository = new TransactionRepository();
        this.userService = new UserService();
        this.portfolioService = new PortfolioService();
    }



    async createTransaction(data) {
        try {
            if (!data || !data.userId || !data.aktienFondsSymbol || !data.gesamtwert || !data.menge) {
                throw new Error('Invalid transaction data');
            }
            return await this.transactionRepository.createTransaction(data);
            
        } catch (error){
            featureFlagService.log('error', 'Error creating Transaction', error);
            return null;
        }
    }



    async processPurchase(data) {
        try {
            if (!data || !data.userId || !data.gesamtwert) {
                throw new Error('Invalid purchase data');
            }

            const user = await this.userService.getUserById(data.userId);
            if (user.budget < data.gesamtwert) {
                throw new Error('Insufficient Funds');
            }

            await this.userService.decreaseUserBudget(data.userId, data.gesamtwert);
            const newPortfolio = await this.portfolioService.updatePortfolioEntry(data);

            const newTransaction = await this.createTransaction({
                userId: data.userId,
                isKauf: true,
                aktienFondsSymbol: data.aktienFondsSymbol,
                aktienFondsName: data.aktienFondsName,
                einzelwert: data.einzelwert,
                gesamtwert: data.gesamtwert,
                menge: data.menge,
                isFund: data.isFund,
            });
            return { newTransaction, newPortfolio };

        } catch (error) {
            featureFlagService.log('error', 'Error processing purchase:', error);
            return null;
        }
    }

    async processSale(data) {
        try {
            if (!data || !data.userId || !data.gesamtwert) {
                throw new Error('Invalid sale data');
            }

            await this.userService.increaseUserBudget(data.userId, data.gesamtwert);
            const saleData = { ...data, menge: -Number(data.menge) };
            const newPortfolio = await this.portfolioService.updatePortfolioEntry(saleData);

            const newTransaction = await this.createTransaction({
                userId: data.userId,
                isKauf: false,
                aktienFondsSymbol: data.aktienFondsSymbol,
                aktienFondsName: data.aktienFondsName,
                einzelwert: data.einzelwert,
                gesamtwert: data.gesamtwert,
                menge: data.menge,
                isFund: data.isFund,
            });
            return { newTransaction, newPortfolio };

        } catch (error) {
            featureFlagService.log('error', 'Error processing sale:', error);
            return null;
        }
    }

    async getTransactionById(id) {
        try {
            if (!id) {
                throw new Error('Transaction ID is required');
            }

            const transaction = await this.transactionRepository.findTransactionById(id);
            if (!transaction) {
                featureFlagService.log('error', 'Transaction not found:', error);
                return null
            }
            return transaction;

        } catch (error) {
            featureFlagService.log('error', 'Error getting transaction by ID:', error);
            return null;
        }
    }

    async updateInventory(userId, symbol, quantity) {
        try {
            if (!userId || !symbol || quantity === undefined) {
                throw new Error('Invalid inventory data');
            }

            const data = { userId, symbol, quantity };
            await this.inventoryRepository.createInventory(data);

        } catch (error) {
            featureFlagService.log('error', 'Error updating inventory:', error);
            return null;
        }
    }

    async getUserTransactions(req, res, isKauf) {
        const userId = req.params.userid;
        if (!userId) {
            return res.status(400).send('User ID is required');
        }

        try {
            featureFlagService.log('info', "Fetching transactions for user ID:", userId);
            const transactions = await this.transactionRepository.findTransactionBy(userId, isKauf);
            if (!transactions || transactions.length === 0) {
                return res.status(404).send('No transactions found for this user');
            }
            res.send(transactions);

        } catch (error) {
            featureFlagService.log('error', 'Error fetching user transactions:', error.message);
            res.status(500).send('An error occurred while fetching user transactions');
        }
    }

    async getUserKaufTransactions(req, res) {
        await this.getUserTransactions(req, res, true);
    }

    async getUserVerkaufTransactions(req, res) {
        await this.getUserTransactions(req, res, false);
    }
}

module.exports = TransactionService;
