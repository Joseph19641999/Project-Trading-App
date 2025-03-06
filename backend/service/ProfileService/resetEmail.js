const UserService = require('../UserService');
const FeatureFlagService = require('../featureFlag');

const userService = new UserService();
const featureFlagService = new FeatureFlagService();

async function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function sendErrorMessage(ws, message, error) {
    ws.send(JSON.stringify({
        status: 'error',
        message: message,
        error: error
    }));
}

async function process_resetEmail(data, ws) {
    const { newEmail, userID } = data.data;

    if (!newEmail || !isValidEmail(newEmail)) {
        return sendErrorMessage(ws, 'Invalid email address for resetting email.');
    }

    if (typeof userID !== 'number' || isNaN(userID) || userID <= 0) {
        return sendErrorMessage(ws, 'Invalid user ID for resetting email.');
    }

    try {
        const emailResetFeatureEnabled = await featureFlagService.isFeatureEnabled('emailReset');
        if (emailResetFeatureEnabled) {
            featureFlagService.log('debug', `Processing email reset for user: ${userID}`);
        }

        const updatedUser = await userService.resetEmail(userID, newEmail);
        ws.send(JSON.stringify({
            status: 'success',
            message: 'User email updated successfully',
            user: updatedUser
        }));

        if (emailResetFeatureEnabled) {
            featureFlagService.log('debug', `Email update successful for user: ${userID}`);
        }
    } catch (error) {
        sendErrorMessage(ws, 'User email update failed', error.message);
        featureFlagService.log('error', `Email update failed for user: ${userID}: ${error.message}`);
    }
}

module.exports = { process_resetEmail };
