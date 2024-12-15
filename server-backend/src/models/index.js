const sequelize = require('../data/connection');
const User = require('./user');
const TokenBlacklist = require('./tokenBlacklist');

/************************ DATABASE INITIALIZATION ************************/

const initializeDatabase = async () => {
  try {
    await sequelize.sync({ alter: true }); // adjusts tables to match models
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

/************************ MODULE EXPORTS ************************/

module.exports = {
  sequelize,
  User,
  TokenBlacklist,
  initializeDatabase
};


