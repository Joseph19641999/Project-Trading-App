var typeorm = require("typeorm")
var EntitySchema = typeorm.EntitySchema;

var FeatureFlagService = require('../../service/featureFlag');
var featureFlags = new FeatureFlagService();

var withdocker = "postgresdb";
var withoutdocker = "localhost";
const cloudSQLHost = '/cloudsql/boreal-antonym-425218-t7:europe-west3:postgresdb'; // Update with your actual Cloud SQL connection name

var connectionPromise = typeorm.createConnection({
    type: "postgres",
    host: withdocker,
    port: 5432,
    username: "groupe_c",
    password: "groupe_c",
    database: "usergroupe_c_db",
    synchronize: true,
    entities: [
        new EntitySchema(require('../Models/User')),
        new EntitySchema(require('../Models/Transaction')),
        new EntitySchema(require('../Models/Portofolio')),
        new EntitySchema(require('../Models/Favorite')),
        new EntitySchema(require('../Models/Asset')),
        
    ]

}).then(function (connection) {
    featureFlags.log('info', "Connection with Postgres database successful");
    return connection;
}).catch(function (error) {
    featureFlags.log('error', `Error connecting to PostgreSQL: ${error.message}`);
});

module.exports = connectionPromise;
