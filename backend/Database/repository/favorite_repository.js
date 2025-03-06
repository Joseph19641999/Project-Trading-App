const { getRepository } = require("typeorm");
const Favorite = require("../Models/Favorite");
const FeatureFlagService = require('../../service/featureFlag');

const featureFlagService = new FeatureFlagService();

class FavoriteRepository {
    constructor() {
        this.repo = getRepository(Favorite);
        featureFlagService.log('info', 'Favorite repository initialized:', this.repo);
    }

    async addFavorite(userId, assetSymbol) {
        try {
            let favorite = await this.repo.findOne({ where: { userId } });
            if (!favorite) {
                throw new Error('Favorite not found.');
            }

            featureFlagService.log('info', 'Updating favorite:', { userId, assetSymbol });
            favorite.assetSymbols.push(assetSymbol);
            return await this.repo.save(favorite);
            
        } catch (error) {
            featureFlagService.log('error', 'Error adding favorite:', error);
            return null;
        }
    }

    async createFavorite(userId, assetSymbol) {
        try {
            featureFlagService.log('info', 'Creating favorite:', { userId, assetSymbol });
            const newFavorite = this.repo.create({ userId, assetSymbols: [assetSymbol] });
            return await this.repo.save(newFavorite);

        } catch (error) {
            featureFlagService.log('error', 'Error creating favorite:', error);
            return null;
        }
    }

    async getFavorites(userId) {
        try {
            featureFlagService.log('info', 'Retrieving favorites for user ID:', userId);
            return await this.repo.find({ where: { userId } });

        } catch (error) {
            featureFlagService.log('error', 'Error retrieving favorites:', error);
            return null;
        }
    }

    async getFavorite(userId, assetSymbol) {
        try {
            const favorite = await this.repo.findOne({ where: { userId } });
            if (!favorite) {
                return false;
            }
            return favorite.assetSymbols.includes(assetSymbol);

        } catch (error) {
            featureFlagService.log('error', 'Error checking favorite:', error);
            return null;
        }
    }

    async deleteFavorite(userId, assetSymbol) {
        try {
            const favorite = await this.repo.findOne({ where: { userId } });
            if (!favorite) {
                throw new Error('Favorite not found.');
            }
            
            featureFlagService.log('info', 'Deleting favorite:', { userId, assetSymbol });
            favorite.assetSymbols = favorite.assetSymbols.filter(s => s !== assetSymbol);
            await this.repo.save(favorite);
            
        } catch (error) {
            featureFlagService.log('error', 'Error deleting favorite:', error);
            return null;
        }
    }
}

module.exports = FavoriteRepository;
