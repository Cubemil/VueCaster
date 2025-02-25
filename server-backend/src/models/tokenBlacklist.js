const { DataTypes } = require('sequelize');
const sequelize = require('../data/connection');

/************************ DEFINE USER MODEL ************************/

const TokenBlacklist = sequelize.define('TokenBlacklist', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  reason: {
    type: DataTypes.STRING,
    allowNull: true
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  }
});

async function cleanUpExpiredTokens() {
  try {
    await TokenBlacklist.destroy({
      where: {
        expiresAt: {
          [Op.lt]: new Date()
        }
      }
    });
  } catch (error) {
    console.error('Error cleaning up expired tokens:', error);
  }
}

/************************ EXPORT USER MODEL ************************/

module.exports = TokenBlacklist;