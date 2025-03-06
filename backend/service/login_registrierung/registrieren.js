const UserService = require('../UserService');
const bcrypt = require('bcryptjs');
const FeatureFlagService = require('../featureFlag');

const featureFlagService = new FeatureFlagService();
const userService = new UserService();

async function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

async function process_registration(data, ws) {
    try {
        const { Vorname, Nachname, Email, Geburtsdatum, Passwort } = data.data;

        if (!Email || !isValidEmail(Email)) {
            return ws.send(JSON.stringify({
                status: 'error',
                message: 'Invalid email address for resetting email.'
            }));
        }

        if (!Passwort || !Vorname || !Nachname ) {
            return ws.send(JSON.stringify({
                status: 'error',
                message: 'Missing required fields: Passwort, Vorname, and Nachname are required.'
            }));
        }

        const nameRegex = /^[A-Za-zäöüÄÖÜß]+$/;

        if (typeof Passwort !== 'string' || typeof Vorname !== 'string' || !nameRegex.test(Vorname) || !nameRegex.test(Nachname)) {
            return ws.send(JSON.stringify({
                status: 'error',
                message: 'Wrong type of data received.'
            }));
        }

        featureFlagService.log('info', `Registration request for email: ${Email}`);

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(Passwort, saltRounds);

        const newUser = await userService.registerUser(Vorname, Nachname, Email, Geburtsdatum, hashedPassword);

        ws.send(JSON.stringify({
            status: 'success',
            message: 'User registered successfully',
            user: newUser
        }));

        featureFlagService.log('info', `User registered successfully: ${Email}`);
    } catch (error) {
        featureFlagService.log('error', `Error processing registration: ${error.message}`);
        ws.send(JSON.stringify({
            status: 'error',
            message: 'User registration failed',
            error: error.message
        }));
    }
}

module.exports = { process_registration };
