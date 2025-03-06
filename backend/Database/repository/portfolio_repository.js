const { getRepository } = require("typeorm");
const Portfolio = require("../Models/Portofolio");
const FeatureFlagService = require('../../service/featureFlag');
const { error } = require("console");
const featureFlagService = new FeatureFlagService();

class PortfolioRepository {
    constructor() {
        this.repo = getRepository(Portfolio);
        featureFlagService.log('info', "Portfolio repository initialized:", this.repo);
    }

    async createPortfolioEntry(data) {
        try {
            featureFlagService.log('info', "Creating portfolio entry:", data);
            const newEntry = this.repo.create(data);
            return await this.repo.save(newEntry);

        } catch (error) {
            featureFlagService.log('error', 'Error creating portfolio entry:', error);
            return null;
        }
    }

    async updatePortfolioEntry(data) {
        try {
            featureFlagService.log('info', "Updating portfolio entry:", data);
            const entry = await this.findPortfolioEntryBySymbol(data.userId, data.aktienFondsSymbol);

            if (!entry) {
                throw new Error('Portfolio entry not found.');
            }

            Object.assign(entry, data);
            return await this.repo.save(entry);

        } catch (error) {
            featureFlagService.log('error', "Error updating portfolio entry:", error);
            return null;
        }
    }

    async findPortfolioEntryBySymbol(userId, symbol) {
        try {
            featureFlagService.log('info', "Finding portfolio entry by symbol:", symbol);
            return await this.repo.findOne({ where: { userId, aktienFondsSymbol: symbol } });

        } catch (error) {
            featureFlagService.log('error', "Error finding portfolio entry by symbol:", error);
            return null;
        }
    }

    async findPortfolioEntriesByUserId(userId) {
        try {
            featureFlagService.log('info', "Finding portfolio entries by user ID:", userId);
            return await this.repo.find({ where: { userId } });

        } catch (error) {
            featureFlagService.log('error', "Error finding portfolio entries by user ID:", error);
            return null;
        }
    }

    async deletePortfolioEntryById(userId, symbol) {
        try {
            featureFlagService.log('info', "Deleting portfolio entry by ID:", userId, symbol);
            const entry = await this.findPortfolioEntryBySymbol(userId, symbol);

            if (!entry) {
                featureFlagService.log('warn', 'Portfolio entry not found.');
                throw error;
            }

            const deleteResult = await this.repo.remove(entry);
            featureFlagService.log('info', 'Portfolio entry deleted successfully:', deleteResult);
            return deleteResult;

        } catch (error) {
            featureFlagService.log('error', 'Error deleting portfolio entry:', error);
            return null;
        }
    }

    async findPortfolioById(id) {
        try {
            return await this.repo.findOne({ where: { id } });
        } catch (error) {
            featureFlagService.log('error', 'Error finding portfolio by ID:', error);
            return null;
        }
    }
    
    async findPortfolioByUserID(userId) {
        try {
            return await this.repo.find({ where: { userId } });
        } catch (error) {
            featureFlagService.log('error', 'Error finding portfolio by user ID:', error);
            return null;
        }
    }
    
    async findPortfolioBy(userId, isFund) {
        try {
            return await this.repo.findBy({ userId, isFund });
        } catch (error) {
            featureFlagService.log('error', 'Error finding portfolio by user ID and fund:', error);
            return null;
        }
    }
    
    async updateEinzelwert(userId, einzelwert, aktienFondsSymbol) {
        try {
            return await this.repo.update({ userId, aktienFondsSymbol }, { einzelwert });
        } catch (error) {
            featureFlagService.log('error', 'Error updating einzelwert:', error);
            return null;
        }
    }
    
    async updateGesamtwert(userId, gesamtwert, aktienFondsSymbol) {
        try {
            return await this.repo.update({ userId, aktienFondsSymbol }, { gesamtwert });
        } catch (error) {
            featureFlagService.log('error', 'Error updating gesamtwert:', error);
            return null;
        }
    }
    
    async updateRendite(userId, rendite, aktienFondsSymbol) {
        try {
            return await this.repo.update({ userId, aktienFondsSymbol }, { rendite });
        } catch (error) {
            featureFlagService.log('error', 'Error updating rendite:', error);
            return null;
        }
    }
    
    async updateRenditeProzent(userId, rendite_in_procent, aktienFondsSymbol) {
        try {
            return await this.repo.update({ userId, aktienFondsSymbol }, { rendite_in_procent });
        } catch (error) {
            featureFlagService.log('error', 'Error updating rendite in percent:', error);
            return null;
        }
    }
    
}

module.exports = PortfolioRepository;
