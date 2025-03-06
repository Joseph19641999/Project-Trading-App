const UserRepository = require("../Database/repository/User_repository");
const bcrypt = require('bcryptjs');
const FeatureFlagService = require('./featureFlag');

const featureFlagService = new FeatureFlagService();

class UserService {
    constructor() {
        this.userRepository = new UserRepository();
    }

    async addUser(userData) {
        try {
            if (!userData.vorname || !userData.nachname || !userData.email || !userData.geburtsdatum || !userData.password) {
                throw new Error('Incomplete user data');
            }

            return await this.userRepository.createUser(userData);

        } catch (error) {
            featureFlagService.log('error', 'Error adding user:', error);
            return null;
        }
    }

    async getUserById(userId) {
        try {
            return await this.userRepository.findUserById(userId);

        } catch (error) {
            featureFlagService.log('error', 'Error getting user by ID:', error);
            return null;
        }
    }



    
    async validateUser(email, password) {
        try {
            email = email.trim().toLowerCase();
            featureFlagService.log('info', `Validating user for email: ${email}`);
            const user = await this.userRepository.findUserByEmail(email);

            if (!user) {
                featureFlagService.log('error', 'No user found with that email.');
                throw error;
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                featureFlagService.log('info', 'User validated successfully.', user);
                return user;
            } else {
                featureFlagService.log('error', 'Password does not match.');
                throw error;
            }

        } catch (error) {
            featureFlagService.log('error', 'Error validating user:', error);
            return null;
        }
    }

    async registerUser(vorname, nachname, email, geburtsdatum, password) {
        try {
            const existingUser = await this.userRepository.findUserByEmail(email);
            if (existingUser) {
                throw new Error('User already exists with this email');
            }

            const newUser = {
                vorname,
                nachname,
                email,
                geburtsdatum,
                password,
                budget: 0.00
            };

            featureFlagService.log('info', 'Proceeding to registration!');
            return await this.userRepository.createUser(newUser);

        } catch (error) {
            featureFlagService.log('error', 'Error registering user:', error);
            return null;
        }
    }




    async rechargeBudget(email, budget) {
        try {
            const existingUser = await this.userRepository.findUserByEmail(email);
            if (!existingUser) {
                throw new Error('User not found with this email');
            }

            const userID = existingUser.id;
            const newBudget = Number(existingUser.budget) + budget;

            featureFlagService.log('info', `Recharging budget for user ${email}, UserID: ${userID}, New Budget: ${newBudget}`);
            return await this.userRepository.updateBudget(userID, newBudget);

        } catch (error) {
            featureFlagService.log('error', 'Error recharging budget:', error);
            return null;
        }
    }




    async decreaseUserBudget(userId, amount) {
        try {
            const user = await this.userRepository.findUserById(userId);
            if (user.budget < amount) {
                throw new Error('Not enough budget');
            }
            user.budget -= amount;
            await this.userRepository.updateBudget(userId, user.budget);
            featureFlagService.log('info', 'Budget decreased successfully!');

        } catch (error) {
            featureFlagService.log('error', 'Error decreasing budget:', error);
            return null;
        }
    }

    async increaseUserBudget(userId, amount) {
        try {
            const user = await this.userRepository.findUserById(userId);
            const newBudget = Number(user.budget) + Number(amount);
            await this.userRepository.updateBudget(userId, newBudget);
            featureFlagService.log('info', 'Budget increased successfully!');

        } catch (error) {
            featureFlagService.log('error', 'Error increasing budget:', error);
            return null;
        }
    }




    async resetPassword(email, password) {
        try {
            const existingUser = await this.userRepository.findUserByEmail(email);
            
            if (existingUser) {
                featureFlagService.log('debug', `Found user with email: ${email}`);
                const result = await this.userRepository.resetPasswort(email, password);
                featureFlagService.log('debug', `Password reset for user: ${email} was successful`);
                return result;
            } else {
                featureFlagService.log('debug', `No user found with email: ${email}`);
                throw error;
            }
        } catch (error) {
            featureFlagService.log('error', 'Error resetting password:', error);
            return null;
        }
    }

    async resetEmail(userId, email) {
        try {
            const updatedUser = await this.userRepository.resetEmail(userId, email);
            featureFlagService.log('info', 'User email successfully updated!');
            return updatedUser;

        } catch (error) {
            featureFlagService.log('error', 'Error updating user email:', error.message);
            return null;
        }
    }
}




module.exports = UserService;
