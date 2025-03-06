const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;
const PostgresConnection = require('../Database/config/Postgres_index');

const { process_registration } = require('../service/login_registrierung/registrieren.js');
const { process_login } = require('../service/login_registrierung/login');
const { process_resetpassword } = require('../service/ProfileService/resetpasswort');
const { process_rechargeBudget } = require('../service/ProfileService/rechargeBudget');
const { process_resetEmail } = require('../service/ProfileService/resetEmail');
const axios = require('axios');
const FeatureFlagService = require('../service/featureFlag.js');

const assetRoutes = require('../controller/assetcontroller.js');
const portofoliosData = require('../controller/portfoliocontroller');
const userRoutes = require('../controller/usercontroller');
const transactionRoutes = require('../controller/transactioncontroller.js');
const portfolioRoutes = require('../controller/portfoliocontroller.js');
const favoriteRoutes = require('../controller/favoritecontroller.js');

const featureFlagService = new FeatureFlagService();

PostgresConnection.then(connection => {
    featureFlagService.log('info', 'Postgres Database connected, starting server...');
}).catch(error => {
    featureFlagService.log('error', `Failed to connect to Postgres database: ${error}`);
});


// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use('/', userRoutes);
app.use('/', transactionRoutes);
app.use('/', assetRoutes);
app.use('/', portofoliosData);
app.use('/', portfolioRoutes);
app.use('/', favoriteRoutes);

const wss = new WebSocket.Server({ port: 8081 });

featureFlagService.log('info', 'HTTP and WebSocket server is running.');

app.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
    });
});

wss.on('connection', function connection(ws) {
    featureFlagService.log('info', 'A new WebSocket client connected!');

    ws.send(JSON.stringify({ message: 'Welcome to the WebSocket server!' }));

    ws.on('message', async message => {
        featureFlagService.log('debug', `Received: ${message}`);
        const data = JSON.parse(message);

        switch (data.type) {
            case 'register':
                await process_registration(data, ws);
                featureFlagService.log('info', `User registered: ${data.data.Vorname}`);
                break;
            case 'login':
                await process_login(data, ws);
                break;
            case 'search':
                const { query } = data;
                featureFlagService.log('info', `Query: ${query}`);
                const url = `https://financialmodelingprep.com/api/v3/search?query=${query}&exchange=NASDAQ&apikey=toUYRwfs9fxQWkUDcEV8cTlEgnkMOkPT`;
                try {
                    const response = await axios.get(url);
                    featureFlagService.log('info', 'Data fetched from FMP API');
                    ws.send(JSON.stringify(response.data));
                } catch (error) {
                    featureFlagService.log('error', `Error fetching data from FMP API: ${error}`);
                    ws.send(JSON.stringify({ error: 'Failed to fetch data', details: error.message }));
                }
                break;
            case 'get_stock_fundamental_data':
                await getStockFundamentalData(data.id, ws);
                break;
            case 'update_budget':
                await process_rechargeBudget(data, ws);
                break;
            case 'reset_password':
                await process_resetpassword(data, ws);
                break;
            case 'reset_email':
                await process_resetEmail(data, ws);
                break;
            default:
                featureFlagService.log('warn', `Unrecognized message type: ${data.type}`);
        };
    });

    ws.on('close', () => {
        featureFlagService.log('info', 'A client disconnected');
    });

    setInterval(() => {
        ws.send(JSON.stringify({ message: 'Hello from the server!' }));
    }, 5000);
});

wss.on('error', (error) => {
    featureFlagService.log('error', `WebSocket encountered an error: ${error}`);
});

try {
    app.listen(port, () => {
        featureFlagService.log('info', `HTTP server running on http://localhost:${port}`);
    });
} catch (error) {
    featureFlagService.log('error', `Error starting HTTP server: ${error}`);
}

