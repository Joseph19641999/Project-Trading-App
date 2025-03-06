// connection.test.js
const typeorm = require("typeorm");
const FeatureFlagService = require('../../service/featureFlag');

jest.mock("typeorm");
jest.mock('../../service/featureFlag');

describe("Database Connection", () => {
    let featureFlags;
    let connectionPromise;

    beforeAll(() => {
        featureFlags = new FeatureFlagService();
    });

    beforeEach(() => {
        jest.clearAllMocks();
        // Mock the createConnection function before importing the connectionPromise
        typeorm.createConnection.mockResolvedValue({});
        connectionPromise = require('./Postgres_index');
    });

    test("should fail to connect to the database", async () => {
        // Arrange
        const errorMessage = "Connection failed";
        typeorm.createConnection.mockRejectedValue(new Error(errorMessage));

        // Act
        try {
            await connectionPromise;
        } catch (error) {
            // Assert
            expect(error.message).toBe(errorMessage);
            expect(typeorm.createConnection).toHaveBeenCalledWith({
                type: "postgres",
                host: "localhost",
                port: 5432,
                username: "groupe_c",
                password: "groupe_c",
                database: "usergroupe_c_db",
                synchronize: true,
                entities: [
                    expect.any(Object),
                    expect.any(Object),
                    expect.any(Object),
                    expect.any(Object),
                    expect.any(Object)
                ]
            });
            expect(featureFlags.log).toHaveBeenCalledWith('error', `Error connecting to PostgreSQL: ${errorMessage}`);
        }
    });
});
