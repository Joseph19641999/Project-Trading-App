const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../service/AuthentifizierungService/AuthentifizierungService');
const UserService = require("../service/UserService");

const userService = new UserService();

const FeatureFlagService = require('../service/featureFlag');
const featureFlags = new FeatureFlagService();




router.post('/users', async (req, res) => {
    try {
        const userData = req.body;
        if (!userData || !userData.email || !userData.vorname || !userData.nachname || !userData.password || !userData.geburtsdatum) {
            return res.status(400).json({ error: 'Invalid user data' });
        }

        const user = await userService.addUser(userData);
        res.status(201).json(user);
        featureFlags.log('info', `Added new user: ${user.username}`);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
        featureFlags.log('error', `Failed to add new user: ${error.message}`);
    }
});



router.get('/user/:id', authenticateToken, async (req, res) => {
    try {
        const userId = req.params.id;

        if (!userId) {
            return res.status(400).json({ error: 'User ID parameter is missing' });
        }

        const user = await userService.getUserById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
        featureFlags.log('info', `Retrieved user data for ID: ${userId}`);

    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
        featureFlags.log('error', `Failed to retrieve user data for ID: ${req.params.id}: ${error.message}`);
    }
});

module.exports = router;
