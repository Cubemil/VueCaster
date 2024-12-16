const { DataTypes } = require('sequelize');
const sequelize = require('../data/connection');
const { Op } = require('sequelize');

/************************ DEFINE USER MODEL ************************/

/**
 * Sequelize model representing failed login attempts.
 * @typedef {Object} FailedLogins
 * @property {string} identifier - The unique identifier for the login attempt (e.g., username or email)
 * @property {number} failedLogins - Number of consecutive failed login attempts, defaults to 0
 * @property {Date} lockedUntil - Timestamp indicating when the account lock expires
 */
const FailedLogins = sequelize.define('FailedLogins', {
  identifier: {
    type: DataTypes.STRING,
    allowNull: false
  },
  failedLogins: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lockedUntil: {
    type: DataTypes.DATE
  }
});

/************************ MODEL METHODS ************************/

/**
 * Removes expired failed login attempts from the database.
 * Deletes all records where the lockedUntil timestamp is earlier than the current date.
 * @async
 * @function cleanUpLoginFails
 * @throws {Error} Logs error to console if database operation fails
 * @returns {Promise<void>}
 */
async function cleanUpLoginFails() {
  try {
    await FailedLogins.destroy({
      where: {
        lockedUntil: {
          [Op.lt]: new Date()
        }
      }
    });
  } catch (error) {
    console.error('Error cleaning up failed logins:', error);
  }
}

/************************ EXPORT USER MODEL ************************/

module.exports = FailedLogins;