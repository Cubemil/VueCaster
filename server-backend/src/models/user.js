const { Sequelize, DataTypes } = require('sequelize');

/************************ DATABASE CONNECTION ************************/

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './src/data/users.db'
});

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
  roles: {
    type: DataTypes.ENUM('user', 'admin'),
    defaultValue: 'user'
  }
});

/************************ DATABASE INITIALIZATION ************************/

const initializeDatabase = async () => {
  try {
    await sequelize.sync({ alter: true }); // adjusts tables to match models
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

/************************ EXPORT MODULES ************************/

module.exports = {
  User,
  initializeDatabase,
  sequelize
};