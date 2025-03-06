const FavoriteRepository = require('../Database/repository/favorite_repository');
const FeatureFlagService = require('./featureFlag');
const AssetService = require('./AssetService');
const AssetRepository = require('../Database/repository/asset_repository');

const featureFlagService = new FeatureFlagService();

class FavoriteService {
    constructor() {
        this.favoriteRepository = new FavoriteRepository();
        this.assetRepository = new AssetRepository();
        this.assetService = new AssetService();
    }

    async addFavorite(userId, assetSymbol) {
        try {
            if (!userId || !assetSymbol) {
                throw new Error('User ID and asset symbol are required to add a favorite.');
            }

            const existingFavorites = await this.favoriteRepository.getFavorites(userId);

            if (existingFavorites.length === 0) {
                featureFlagService.log('info', 'Creating favorite for user:', { userId, assetSymbol });
                return await this.favoriteRepository.createFavorite(userId, assetSymbol);
            } else {
                const favorite = existingFavorites[0];

                if (favorite.assetSymbols.includes(assetSymbol)) {
                    featureFlagService.log('info', 'Removing favorite for user:', { userId, assetSymbol });
                    await this.favoriteRepository.deleteFavorite(userId, assetSymbol);
                    return { message: 'Favorite removed.' };
                } else {
                    if (favorite.assetSymbols.length >= 20) {
                        throw new Error('You can only have up to 20 favorite assets.');
                    }

                    await this.assetService.addAsset(assetSymbol);

                    featureFlagService.log('info', 'Adding favorite for user:', { userId, assetSymbols: favorite.assetSymbols });
                    return await this.favoriteRepository.addFavorite(userId, assetSymbol);
                }
            }
        } catch (error) {
            featureFlagService.log('error', 'Error adding favorite:', error);
            return null;
        }
    }

    async getFavoritesFromTable(userId) {
        try {
            if (!userId) {
                throw new Error('User ID is required for fetching favorites.');
            }

            featureFlagService.log('info', `Fetching favorites for user: ${userId}`);
            const favorites = await this.getFavorites(userId);

            if (!favorites || favorites.length === 0) {
                featureFlagService.log('info', `No favorites found for user: ${userId}`);
                return [];
            }

            const assetPromises = favorites.map(async (item) => {
                const asset = await this.assetRepository.findBySymbol(item);
                return asset;
            });

            return await Promise.all(assetPromises);
        } catch (error) {
            featureFlagService.log('error', `Error fetching favorites for user: ${userId}`, error);
            return null;
        }
    }

    async getFavorites(userId) {
        try {
            if (!userId) {
                throw new Error('User ID is required for fetching favorites.');
            }

            featureFlagService.log('info', `Fetching favorites for user: ${userId}`);
            const favorites = await this.favoriteRepository.getFavorites(userId);

            if (!favorites || favorites.length === 0) {
                featureFlagService.log('info', `No favorites found for user: ${userId}`);
                return [];
            }

            if (!favorites[0].assetSymbols) {
                throw new Error(`No asset symbols found in favorites for user: ${userId}`);
            }

            return favorites[0].assetSymbols;
        } catch (error) {
            featureFlagService.log('error', `Error fetching favorites for user: ${userId}`, error);
            return null;
        }
    }

    async isFavorite(userId, assetSymbol) {
        try {
            if (!userId || !assetSymbol) {
                throw new Error('User ID and asset symbol are required.');
            }

            const favorite = await this.favoriteRepository.getFavorite(userId, assetSymbol);
            return !!favorite;
        } catch (error) {
            featureFlagService.log('error', 'Error checking favorite:', error);
            return null;
        }
    }
}

module.exports = FavoriteService;
