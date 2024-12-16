const { DataTypes } = require('sequelize');
const sequelize = require('../data/connection');

/************************ DEFINE USER MODEL ************************/

const User = sequelize.define('User', {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    /*validate: {
      len: [8, 20],
    }*/
  },
  token: {
    type: DataTypes.STRING
  },
  tokenExpiration: {
    type: DataTypes.DATE
  },
  loginAttempts: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  lockedUntil: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

/************************ EXPORT USER MODEL ************************/

module.exports = User;