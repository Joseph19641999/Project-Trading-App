const { getRepository } = require("typeorm");
const Transaction = require("../Models/Transaction");
const FeatureFlagService = require('../../service/featureFlag');
const featureFlagService = new FeatureFlagService();

class TransactionRepository {
    constructor() {
        this.repo = getRepository(Transaction);
        featureFlagService.log('info', "Transaction repository initialized:", this.repo);
    }

    async createTransaction(data) {
        try {
            featureFlagService.log('info', 'Creating transaction:', data);
            const newTransaction = this.repo.create(data);
            return await this.repo.save(newTransaction);
            
        } catch (error) {
            featureFlagService.log('error', 'Error creating transaction:', error);
            return null;
        }
    }

    async findTransactionById(id) {
        try {
            featureFlagService.log('info', 'Finding transaction by ID:', id);
            return await this.repo.findOne({ where: { id } });

        } catch (error) {
            featureFlagService.log('error', 'Error finding transaction by ID:', error);
            return null;
        }
    }

    async findTransactionByUserID(userId) {
        try {
            featureFlagService.log('info', 'Finding transactions by user ID:', userId);
            return await this.repo.find({ where: { userId } });

        } catch (error) {
            featureFlagService.log('error', 'Error finding transactions by user ID:', error);
            return null;
        }
    }

    async findTransactionBy(userId, isKauf) {
        try {
            featureFlagService.log('info', 'Finding transactions by user ID and type:', userId, isKauf);
            return await this.repo.find({ where: { userId, isKauf } });

        } catch (error) {
            featureFlagService.log('error', 'Error finding transactions by user ID and type:', error);
            return null;
        }
    }

    async findTransactionByUserIDSymbol(userId, aktienFondsSymbol, isKauf) {
        try {
            featureFlagService.log('info', 'Finding transactions by user ID, symbol and type:', userId, aktienFondsSymbol, isKauf);
            return await this.repo.find({ where: { userId, aktienFondsSymbol, isKauf } });

        } catch (error) {
            featureFlagService.log('error', 'Error finding transactions by user ID, symbol and type:', error);
            return null;
        }
    }

    async deleteTransactionById(id) {
        try {
            featureFlagService.log('info', 'Deleting transaction by ID:', id);
            const deleteResult = await this.repo.delete(id);
            return deleteResult;

        } catch (error) {
            featureFlagService.log('error', 'Error deleting transaction:', error);
            return null;
        }
    }
}

module.exports = TransactionRepository;
