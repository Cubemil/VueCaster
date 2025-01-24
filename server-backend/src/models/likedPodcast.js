const { DataTypes } = require('sequelize');
const sequelize = require('../data/connection');

/************************ DEFINE USER MODEL ************************/

const likedPodcast = sequelize.define('LikedPodcast', {
  userId: {
    type: DataTypes.NUMBER,
    allowNull: false
  },
  likedPodcastId: {
    type: DataTypes.NUMBER,
    allowNull: false
  }
});

module.exports = likedPodcast;