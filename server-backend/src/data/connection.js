const { Sequelize } = require('sequelize');

/************************ DATABASE CONNECTION ************************/

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './src/data/users.db'
});

/************************ EXPORTS ************************/

module.exports = sequelize;