const { getRepository } = require("typeorm");
const User = require("../Models/User");
const FeatureFlagService = require('../../service/featureFlag');
const featureFlagService = new FeatureFlagService();


class UserRepository {
    constructor() {
        this.repo = getRepository(User);
        featureFlagService.log('info', 'User repository initialized:', this.repo);
    }

    async createUser(data) {
        try {
            if (!data.email || !data.password) {
                throw new Error('Email and password are required to create a user.');
            }

            featureFlagService.log('info', 'Creating user:', data);
            const newUser = this.repo.create(data);
            return await this.repo.save(newUser);

        } catch (error) {
            featureFlagService.log('error', 'Error creating user:', error);
            return null;
        }
    }

    async findUserById(id) {
        try {
            featureFlagService.log('info', 'Finding user by ID:', id);
            return await this.repo.findOne({ where: { id } });

        } catch (error) {
            featureFlagService.log('error', 'Error finding user by ID:', error);
            return null;
        }
    }

    async findUserByEmail(email) {
        try {
            const normalizedEmail = email.trim().toLowerCase();
            featureFlagService.log('info', 'Finding user by email:', normalizedEmail);
            return await this.repo.findOne({ where: { email: normalizedEmail } });

        } catch (error) {
            featureFlagService.log('error', 'Error finding user by email:', error);
            return null;
        }
    }

    async findUserIDbyEmail(email) {
        try {
            if (!email) {
                throw new Error('Email is required to find a user ID.');
            }

            const normalizedEmail = email.trim().toLowerCase();

            featureFlagService.log('info', 'Finding user ID by email:', normalizedEmail);
            const user = await this.repo.findOne({
                select: ['id'],
                where: { email: normalizedEmail }
            });

            if (!user) {
                throw new Error('No user found with this email.');
            }
            return user.id;

        } catch (error) {
            featureFlagService.log('error', 'Error finding user by email:', error);
            return null;
        }
    }

    async updateBudget(id, budget) {
        try {
            if (!id || !budget) {
                throw new Error('Invalid input: id and budget are required.');
            }

            const updateResult = await this.repo.update({ id }, { budget });
            featureFlagService.log('info', 'Updated budget for user ID:', id, 'New budget value:', budget);
            return updateResult;

        } catch (error) {
            featureFlagService.log('error', 'Error updating budget:', error);
            return null;
        }
    }
    




    async resetPasswort(email, password){
        try {
            const normalizedEmail = email.trim().toLowerCase();
            const updateResult = await this.repo.update({ email: normalizedEmail }, { password });
            return updateResult;

        } catch (error) {
            featureFlagService.log('error', 'Error resetting password:', error);
            return null;
        }
    }

    async resetEmail(id, email) {
        try {
            const updateResult = await this.repo.update({ id }, { email });
            return updateResult;

        } catch (error) {
            featureFlagService.log('error', 'Error resetting email:', error);
            return null;
        }
    }
}

module.exports = UserRepository;
