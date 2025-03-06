const UserService = require('../UserService');
const bcrypt = require('bcryptjs');
const FeatureFlagService = require('../featureFlag');

const userService = new UserService();
const featureFlagService = new FeatureFlagService();





async function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function sendErrorMessage(ws, message) {
    ws.send(JSON.stringify({
        status: 'error',
        message: message
    }));
}

async function process_resetpassword(data, ws) {
    const { email, lastPassword, newPassword } = data.data;

    if (!email || !isValidEmail(email) || !lastPassword || !newPassword) {
        return sendErrorMessage(ws, 'Invalid input parameters');
    }

    if (typeof newPassword !== 'string') {
        return ws.send(JSON.stringify({
            status: 'error',
            message: 'Password is required and must be a string',
        }));
    }

    featureFlagService.log('debug', `Processing password reset for user: ${email}`);
    const saltRounds = 10;

    try {
        const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
        const isValidUser = await userService.validateUser(email, lastPassword);

        if (!isValidUser) {
            throw new Error('Invalid current password');
        }

        const updatedUser = await userService.resetPassword(email, hashedNewPassword);

        ws.send(JSON.stringify({
            status: 'success',
            message: 'User password reset successfully',
            user: updatedUser
        }));

        featureFlagService.log('debug', `Password reset successful for user: ${email}`);
    } catch (error) {
        featureFlagService.log('error', `Password reset failed for user: ${email}: ${error.message}`);
        sendErrorMessage(ws, 'Password reset failed');
    }
}

module.exports = { process_resetpassword };
