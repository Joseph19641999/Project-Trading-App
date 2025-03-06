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

async function process_rechargeBudget(data, ws) {
    const { Email, chargeValue } = data.data;
    featureFlagService.log('debug', `Recharging budget for user: ${Email}, Value: ${chargeValue}`);

    if (!Email || !isValidEmail(Email)) {
        return sendErrorMessage(ws, 'Invalid email address for recharging budget.');
    }

    if (!chargeValue || chargeValue <= 0) {
        return sendErrorMessage(ws, 'Invalid charge value for recharging budget.');
    }

    try {
        const updatedUser = await userService.rechargeBudget(Email, chargeValue);
        featureFlagService.log('debug', 'User budget successfully updated');
        ws.send(JSON.stringify({
            status: 'success',
            message: 'User budget updated successfully',
            user: updatedUser
        }));
    } catch (error) {
        featureFlagService.log('error', `Error updating user budget: ${error.message}`);
        sendErrorMessage(ws, 'User budget update failed', error.message);
    }
}

module.exports = { process_rechargeBudget, isValidEmail };
