const UserService = require('../UserService');
const PortfolioService = require('../PortfolioService');
const jwt = require('jsonwebtoken');
const FeatureFlagService = require('../featureFlag');
const AssetService = require('../AssetService');
const FavoriteService = require('../FavoriteService');

const favoriteService = new FavoriteService();
const assetService = new AssetService();
const featureFlagService = new FeatureFlagService();
const userService = new UserService();
const portfolioService = new PortfolioService();


async function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}


async function process_login(data, ws) {
    try {
        const { Email, Passwort } = data.data;

        if (!Email || !isValidEmail(Email)) {
            return ws.send(JSON.stringify({
                status: 'error',
                message: 'Invalid email address for resetting email.'
            }));
        }

        if (!Passwort || typeof Passwort !== 'string') {
            return ws.send(JSON.stringify({
                status: 'error',
                message: 'Password is required and must be a string',
            }));
        }

        featureFlagService.log('info', `Login attempt for email: ${Email}`);

        const user = await userService.validateUser(Email, Passwort);

        if (user) {
            const accessTokenSecret = 'FullStack_So24';
            const token = jwt.sign({ userId: user.id }, accessTokenSecret, { expiresIn: '8h' });

            ws.send(JSON.stringify({
                status: 'success',
                message: 'User logged in successfully',
                token: token,
                user: user
            }));

            featureFlagService.log('info', 'Update process started');
            const userID = user.id;

            await Promise.all([
                portfolioService.updatePortfolioPrice(userID),
                portfolioService.calculrenditUpdaterendit(userID),
                assetService.updateAssetTable(await favoriteService.getFavorites(userID)),
                assetService.updateAssetTable(await assetService.getMostActiveStocks()),
                assetService.updateAssetTable(await assetService.getShowcase())
            ]);

            featureFlagService.log('info', 'Tables update process completed');
        } else {
            ws.send(JSON.stringify({
                status: 'error',
                message: 'Invalid email or password',
            }));
            featureFlagService.log('warn', `Failed login attempt for email: ${Email}`);
        }
    } catch (error) {
        featureFlagService.log('error', `Error processing login: ${error.message}`);
        ws.send(JSON.stringify({
            status: 'error',
            message: 'Internal server error',
            error: error.message
        }));
    }
}


module.exports = { process_login };
