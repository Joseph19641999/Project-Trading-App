const { createLogger, transports, format } = require('winston');

class FeatureFlagService {
    constructor() {
        this.featureFlags = {};
        this.logger = createLogger({
            level: 'debug', // info, error , warn, debug(alles)
            format: format.combine(
                format.simple()
            ),
            transports: [
                new transports.Console()
            ]
        });
    }


    setFeatureFlag(flag, isEnabled) {
        this.featureFlags[flag] = isEnabled;
        this.logger.debug(`Feature flag '${flag}' set to ${isEnabled}`);
    }

    async isFeatureEnabled(flag) {
        return this.featureFlags[flag] ?? false; 
    }

    setLogLevel(level) {
        this.logger.level = level;
    }

    log(level, message) {
        if (this.logger.levels[this.logger.level] >= this.logger.levels[level]) {
            this.logger.log(level, message);
        }
    }
}

module.exports = FeatureFlagService;
