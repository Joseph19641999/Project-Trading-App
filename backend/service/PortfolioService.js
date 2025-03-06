const PortfolioRepository = require("../Database/repository/portfolio_repository");
const fetch = require("node-fetch");

const TransactionRepository=require('../Database/repository/Transaction_repository')
const {format} = require('date-fns');

const API_TOKEN = "toUYRwfs9fxQWkUDcEV8cTlEgnkMOkPT";

const FeatureFlagService = require('./featureFlag');
const featureFlagService = new FeatureFlagService();

class PortfolioService {
    constructor() {
        this.portfolioRepository = new PortfolioRepository();
        this.transactionRepository = new TransactionRepository();
        featureFlagService.log('info', 'PortfolioService initialized');
    }

    async addPortfolio(portfolioData) {
        return this.portfolioRepository.createPortfolioEntry(portfolioData);
    }

    async getPortfolioById(portfolioId) {
        try {
            return await this.portfolioRepository.findPortfolioById(portfolioId);
        } catch (error) {
            featureFlagService.log('error', 'Error fetching portfolio by ID:', error);
            return null;
        }
    }

    async createPortfolioEntry(data) {
        return this.portfolioRepository.createPortfolioEntry(data);
    }

    async deletePortfolioEntry(userId, symbol) {
        return this.portfolioRepository.deletePortfolioEntryById(userId, symbol);
    }

    async updatePortfolio(data) {
        return this.portfolioRepository.updatePortfolioEntry(data);
    }




    async updatePortfolioEntry(data) {
        try {
            const entry = await this.portfolioRepository.findPortfolioEntryBySymbol(data.userId, data.aktienFondsSymbol);
    
            if (entry != null) {
                const menge = entry.menge + data.menge;
                const eintiegkurs = entry.eintiegkurs;
                const aktuellemenge = entry.menge;
                if (menge <= 0) {
                    await this.deletePortfolioEntry(data.userID, data.aktienFondsSymbol);
                    featureFlagService.log('info', `Entry deleted as the total quantity became 0: ${entry.id}`);
                    return;
                }
                const mittelwerteintiegkurs = (eintiegkurs * aktuellemenge + data.menge * data.einzelwert) / menge;
                featureFlagService.log('info', 'Gesamtwerte:', entry.menge);
                featureFlagService.log('info', 'Menge', menge);
                const updatedData = {
                    ...entry,
                    userId: data.userId,
                    menge: menge,
                    gesamtwert: menge * data.einzelwert,
                    einzelwert: data.einzelwert,
                    rendite: data.rendite,
                    rendite_in_procent: data.rendite_in_procent,
                    isFund: data.isFund,
                    eintiegkurs: mittelwerteintiegkurs,
                    aktienFondsSymbol: data.aktienFondsSymbol,
                    aktienFondsName: data.aktienFondsName
                };
                await this.updatePortfolio(updatedData);
            } else {
                if (data.menge < 0) {
                    featureFlagService.log('warn', "Entry not found, sale cannot be completed.");
                    return;
                }
                await this.createPortfolioEntry(data);
            }
        } catch (error) {
            featureFlagService.log('error', "Error updating or deleting portfolio entry:", error);
            return null;;
        }
    }





    async findPortfolioEntriesByUserId(id) {
        this.portfolioRepository.findPortfolioEntriesByUserId(id);
    }

    async getUserPortfolios(req, res) {
        try {  
            const userID = req.params.userid;

            if (!userID){
                throw new Error('User ID is required.');
            }

            featureFlagService.log('info', "Fetching portfolios for user ID:", userID);

            const portfolios = await this.portfolioRepository.findPortfolioByUserID(userID);
            if (!portfolios) {
                return res.status(404).send('No portfolios found for this user');
            }
            res.send(portfolios);
        } catch (error) {
            featureFlagService.log('error', 'Error fetching user portfolios:', error.message);
            res.status(500).send('An error occurred while fetching user portfolios');
        }
    }

    async getUserPortfoliosStock(req, res) {
        try {
            const userID = req.params.userid;

            if (!userID){
                throw new Error('User ID is required.');
            }

            featureFlagService.log('info', "Fetching portfolios for user ID:", userID);

            const portfolios = await this.portfolioRepository.findPortfolioBy(userID, false);
            if (!portfolios) {
                return res.status(404).send('No portfolios found for this user');
            }
            res.send(portfolios);

        } catch (error) {
            featureFlagService.log('error', 'Error fetching user portfolios:', error.message);
            res.status(500).send('An error occurred while fetching user portfolios');
        }
    }

    async getUserPortfoliosFund(req, res) {
        try {
            const userID = req.params.userid;

            if (!userID){
                throw new Error('User ID is required.');
            }

            featureFlagService.log('info', "Fetching portfolios for user ID:", userID);

            const portfolios = await this.portfolioRepository.findPortfolioBy(userID, true);
            if (!portfolios) {
                return res.status(404).send('No portfolios found for this user');
            }
            res.send(portfolios);
        } catch (error) {
            featureFlagService.log('error', 'Error fetching user portfolios:', error.message);
            res.status(500).send('An error occurred while fetching user portfolios');
        }
    }




    async updatePortfolioPrice(userId) {
        try {
            const portfolios = await this.portfolioRepository.findPortfolioByUserID(userId);
            featureFlagService.log('info', "Updateprice stock:", portfolios);

            for (const portfolio of portfolios) {
                const symbol = portfolio.aktienFondsSymbol;
                featureFlagService.log('info', symbol);
                const url = `https://financialmodelingprep.com/api/v3/profile/${symbol}?apikey=${API_TOKEN}`;
                const response = await fetch(url);
                const data = await response.json();
                const einzelwert = data[0].price;
                const menge = portfolio.menge;
                const gesamtwert = menge * einzelwert;
                featureFlagService.log('info', 'Update the price');


                try {
                    await this.portfolioRepository.updateEinzelwert(userId, einzelwert, symbol);
                    featureFlagService.log('info', 'price successfully updated');
                } catch (error) {
                    featureFlagService.log('error', 'Error updating price:', error.message);
                }
                try {
                    await this.portfolioRepository.updateGesamtwert(userId, gesamtwert, symbol);
                    featureFlagService.log('info', 'gesamtwert successfully updated');
                } catch (error) {
                    featureFlagService.log('error', 'Error updating gesamtwert:', error.message);
                }
            }

        } catch (error){
            featureFlagService.log('error', 'Error update portfolio price:', error);
            return null;
        }
    }






    async calculrenditUpdaterendit(userId) {
        try {

            const portfolios = await this.portfolioRepository.findPortfolioByUserID(userId);
            featureFlagService.log('info', portfolios);


            for (const portfolio of portfolios) {
                const { eintiegkurs, einzelwert, menge, aktienFondsSymbol } = portfolio;

                const einzelrendite = einzelwert - eintiegkurs;
                featureFlagService.log(`info', 'einzelrendite: ${einzelrendite}`);

                const rendite = einzelrendite * menge;
                featureFlagService.log(`info', 'rendite: ${rendite}`);

                const rendite_in_procent = ((einzelwert - eintiegkurs) / eintiegkurs) * 100;
                featureFlagService.log(`info', 'einzelrendite in percent : ${rendite_in_procent}`);

                
                try {
                    await this.portfolioRepository.updateRendite(userId, rendite, aktienFondsSymbol);
                    featureFlagService.log('info', 'Rendite updated');
                } catch (error) {
                    featureFlagService.log('error', 'rendite updating failed:', error.message);
                    throw error;
                }

                try {
                    await this.portfolioRepository.updateRenditeProzent(userId, rendite_in_procent, aktienFondsSymbol);
                    featureFlagService.log('info', 'Rendite in percent updated');
                } catch (error) {
                    featureFlagService.log('error', 'rendite in percent updating failed:', error.message);
                    throw error;
                }

            }
    
        } catch (error){
            featureFlagService.log('error', 'Error calc rendite:', error);
            return null;
        }
    }





    async fetchHistoricalData(symbol, startDate, endDate) {
        try {
            const url = `https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?apikey=${API_TOKEN}`;
    
            featureFlagService.log('info', `Fetching data for ${symbol} from ${startDate} to ${endDate}`);
            const response = await fetch(url);
            const data = await response.json();
    
            if (!data || !data.historical) {
                featureFlagService.log('error', `Error fetching historical data for ${symbol}: Invalid response structure`, data);
                throw new Error(`Invalid response structure for ${symbol}`);
            }
    
            const filteredData = data.historical.filter(item => item.date >= startDate && item.date <= endDate).map(item => ({
                date: item.date,
                close: item.close
            }));
    
            return filteredData;
            
        } catch (error) {
            featureFlagService.log('error', `Error fetching historical data: ${error.message}`);
            throw error;
        }
    }





    async getUserPortfolioHistoricalData(req, res, isFund) {
        try {
            const userId = req.params.userid;

            if (!userId){
                throw new Error('User ID is required.');
            }

            featureFlagService.log('info', `Fetching portfolio for user ID ${userId} (isFund: ${isFund})`);
    
            const portfolio = await this.portfolioRepository.findPortfolioBy(userId, isFund);
            const currentDateString = format(new Date(), 'yyyy-MM-dd');
    
            const historicalDataPromises = portfolio.map(async (item) => {
                featureFlagService.log('info', `Processing portfolio item: ${JSON.stringify(item)}`);
                if (!item.aktienFondsSymbol) {
                    const errorMsg = `Portfolio item is missing symbol: ${JSON.stringify(item)}`;
                    featureFlagService.log('error', errorMsg);
                    throw new Error(errorMsg);
                }
    
                const transactions = await this.transactionRepository.findTransactionByUserIDSymbol(userId, item.aktienFondsSymbol, true);
                featureFlagService.log('info', `Transactions for ${item.aktienFondsSymbol}: ${JSON.stringify(transactions)}`);
    
                if (transactions.length === 0) {
                    const errorMsg = `No transactions found for symbol: ${item.aktienFondsSymbol}`;
                    featureFlagService.log('error', errorMsg);
                    throw new Error(errorMsg);
                }
    
                const earliestTransaction = transactions.reduce((earliest, transaction) => {
                    return new Date(transaction.transaktionsdatum) < new Date(earliest.transaktionsdatum) ? transaction : earliest;
                });
    
                const startDateString = format(new Date(earliestTransaction.transaktionsdatum), 'yyyy-MM-dd');
                const historicalData = await this.fetchHistoricalData(item.aktienFondsSymbol, startDateString, currentDateString);
                return {
                    symbol: item.aktienFondsSymbol,
                    historicalData
                };
            });
    
            const historicalDataResults = await Promise.all(historicalDataPromises);
            res.send(historicalDataResults);

        } catch (error) {
            featureFlagService.log('error', `Error fetching historical data: ${error.message}`);
            res.status(500).send({ error: 'Failed to fetch historical data' });
        }
    }
    





    async getUserPortfolioHistoricalDataStock(req, res) {
        return this.getUserPortfolioHistoricalData.call(this, req, res, false);
    }

    async getUserPortfolioHistoricalDataFund(req, res) {
        return this.getUserPortfolioHistoricalData.call(this, req, res, true);
    }







    async getUserPortfolioGesamtwertRendite(req, res, isFund) {
        let gesamtwert = 0;
        let rendit = 0;
        const userId = req.params.userid;
        featureFlagService.log('info', `Fetching portfolio for user ID ${userId} (isFund: ${isFund})`);

        try {
            const portfolio = await this.portfolioRepository.findPortfolioBy(userId, isFund);

            portfolio.forEach(item => {
                featureFlagService.log('info', `Processing portfolio item:`, item);
                if (!item.aktienFondsSymbol) {
                    featureFlagService.log('error', `Portfolio item is missing symbol:`, item);
                    throw new Error(`Portfolio item is missing symbol`);
                }

                gesamtwert += parseFloat(item.gesamtwert);
                rendit += parseFloat(item.rendite);
            });
            featureFlagService.log('info', 'rendit:', rendit);
            featureFlagService.log('info', 'gesamtwert:', gesamtwert);
            res.send({
                gesamtwert,
                rendit
            });

        } catch (error) {
            featureFlagService.log('error', 'Error fetching portfolio data:', error);
            res.status(500).send({ error: 'Failed to fetch portfolio data' });
        }
    }





    async getstockportfolioGewin_gesamtwertStock(req, res) {
        return this.getUserPortfolioGesamtwertRendite.call(this, req, res, false);
    }

    async getstockportfolioGewin_gesamtwertFund(req, res) {
        return this.getUserPortfolioGesamtwertRendite.call(this, req, res, true);
    }
}

module.exports = PortfolioService;
