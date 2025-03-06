const express = require('express');
const router = express.Router();
const FavoriteService = require('../service/FavoriteService');

const favoriteService = new FavoriteService();



router.post('/favorite/add', async (req, res) => {
    try {
        const { userId, assetSymbol } = req.body;

        if (!userId || !assetSymbol) {
            return res.status(400).json({ error: 'User ID and asset symbol are required' });
        }

        const favorite = await favoriteService.addFavorite(userId, assetSymbol);
        res.status(201).json(favorite);

    } catch (error) {
        console.error('Error adding favorite:', error);
        res.status(500).json({ error: error.message });
    }
});


router.get('/favorites/all/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;

        if (!userId) {
            return res.status(400).json({ error: 'User ID parameter is missing' });
        }

        const favorites = await favoriteService.getFavoritesFromTable(userId);
        res.status(201).json(favorites);

    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ error: error.message });
    }
});


router.get('/favorite/check', async (req, res) => {
    try {
        const { userId, assetSymbol } = req.query;

        if (!userId || !assetSymbol) {
            return res.status(400).json({ error: 'User ID and asset symbol are required' });
        }

        const isFavorite = await favoriteService.isFavorite(userId, assetSymbol);
        res.status(201).json({ isFavorite });

    } catch (error) {
        console.error('Error checking favorite:', error);
        res.status(500).json({ error: error.message });
    }
});



module.exports = router;
