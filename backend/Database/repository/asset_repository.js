const { getRepository } = require("typeorm");
const Asset = require('../Models/Asset');
const FeatureFlagService = require('../../service/featureFlag');

const featureFlagService = new FeatureFlagService();

class AssetRepository {
    constructor() {
        this.repo = getRepository(Asset);
    }

    async save(asset) {
        try {
            if (!asset) {
                throw new Error('Asset data is empty or undefined.');
            }
            featureFlagService.log('info', 'Saving asset in the repository:', asset.symbol);
            return await this.repo.save(asset);

        } catch (error) {
            featureFlagService.log('error', 'Error saving asset:', error);
            return null;
        }
    }

    async findBySymbol(symbol) {
        try {
            if (!symbol) {
                throw new Error('Symbol is empty or undefined.');
            }
            featureFlagService.log('info', `Finding asset by symbol: ${symbol}`);
            const asset = await this.repo.findOne({ where: { symbol } });
    
            if (!asset) {
                featureFlagService.log('info', `No asset found for symbol: ${symbol}`);
            }
            return asset;

        } catch (error) {
            featureFlagService.log('error', 'Error finding asset by symbol:', error);
            return null;
        }
    }

    async create(data) {
        try {
            if (!data || !data.symbol) {
                throw new Error('Asset data is incomplete.');
            }
            featureFlagService.log('info', 'Creating asset with symbol:', data.symbol);
            const asset = this.repo.create(data);
            return await this.repo.save(asset);

        } catch (error) {
            featureFlagService.log('error', 'Error creating asset:', error);
            return null;
        }
    }

    async update(data) {
        try {
            if (!data || !data.symbol) {
                throw new Error('Asset data is incomplete.');
            }
            featureFlagService.log('info', 'Updating asset with symbol:', data.symbol);
            let asset = await this.repo.findOne({ where: { symbol: data.symbol } });
            if (!asset) {
                throw new Error('Asset not found');
            }
            this.repo.merge(asset, data);
            return await this.repo.save(asset);

        } catch (error) {
            featureFlagService.log('error', 'Error updating asset:', error);
            return null;
        }
    }
}

module.exports = AssetRepository;
