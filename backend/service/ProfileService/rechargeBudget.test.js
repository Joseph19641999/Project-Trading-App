const { process_rechargeBudget, isValidEmail } = require('./rechargeBudget');
const UserService = require('../UserService');
const FeatureFlagService = require('../featureFlag');

jest.mock('../UserService');
jest.mock('../featureFlag');

describe('process_rechargeBudget', () => {
    let ws;

    beforeEach(() => {
        ws = { send: jest.fn() };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it ('error should be sent if email invalid', async () => {

        const data = {
            data: {
                Email: 'invalidEmail',
                chargeValue: 100
            }

        };

        if (!isValidEmail(data.data.Email)){

            await process_rechargeBudget(data, ws);
            expect(ws.send).toHaveBeenCalledWith(expect.stringContaining('Invalid email address for recharging budget.'));

        }


    });
    



    it('should send error if charge value is invalid', async () => {
        const data = {
            data: {
                Email: 'valid@gmail.com',
                chargeValue: -500
            }
        };

        await process_rechargeBudget(data, ws);
        expect(ws.send).toHaveBeenCalledWith(expect.stringContaining('Invalid charge value'));
    });



    it('should send error if user not found', async () => {
        UserService.prototype.rechargeBudget.mockRejectedValueOnce(new Error('User not found'));
        
        const data = {
            data: {
                Email: 'nonexistent@gmail.com',
                chargeValue: 100
            }
        };

        await process_rechargeBudget(data, ws);
        expect(ws.send).toHaveBeenCalledWith(expect.stringContaining('User not found'));

    });



    it('should send success message if budget recharge successful', async () => {
        UserService.prototype.rechargeBudget.mockResolvedValueOnce({ id: 1, email: 'valid@gmail.com', budget: 150 });

        const data = {
            data: {
                Email: 'valid@gmail.com',
                chargeValue: 100
            }
        };

        await process_rechargeBudget(data, ws);
        expect(ws.send).toHaveBeenCalledWith(expect.stringContaining('User budget updated successfully'));

    });


    
    it('should send error if budget recharge fails', async () => {
        UserService.prototype.rechargeBudget.mockRejectedValueOnce(new Error('Budget recharge failed'));

        const data = {
            data: {
                Email: 'valid@gmail.com',
                chargeValue: 100
            }

        };

        await process_rechargeBudget(data, ws);
        expect(ws.send).toHaveBeenCalledWith(expect.stringContaining('Budget recharge failed'));

    });






});
