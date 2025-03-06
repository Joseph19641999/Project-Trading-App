const jwt = require("jsonwebtoken");
const FeatureFlagService = require("../featureFlag");

const featureFlagService = new FeatureFlagService();

async function authenticateToken(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];

        if (!authHeader) {
            featureFlagService.log('debug', "Authorization header not found");
            return res.sendStatus(401);
        }

        const accessTokenSecret = 'FullStack_So24';
        const token = authHeader.split(' ')[1];

        if (token == null) {
            featureFlagService.log('debug', "No Token received");
            return res.sendStatus(401);
        }

        jwt.verify(token, accessTokenSecret, async (err, user) => {
            if (err) {
                featureFlagService.log('error', "Error verifying token:", err);
                return res.sendStatus(403);
            }
            featureFlagService.log('debug', "Verified user:", user);
            req.user = user;
            next();
        });

    } catch (error) {
        featureFlagService.log('error', "Unexpected error:", error);
        res.sendStatus(500).json({ error: "internal server error"});
    }
}

module.exports = { authenticateToken };
