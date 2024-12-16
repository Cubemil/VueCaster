const sequelize = require('../data/connection');
const { User, TokenBlacklist, FailedLogins } = require('./index.js');

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
  initializeDatabase
};


