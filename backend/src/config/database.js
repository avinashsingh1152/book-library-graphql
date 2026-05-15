const { Sequelize } = require('sequelize');
const path = require('path');

// Firebase Functions filesystem is read-only except /tmp
const defaultStorage = process.env.NODE_ENV === 'production'
  ? '/tmp/database.sqlite'
  : path.join(__dirname, '../../database.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DB_PATH || defaultStorage,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

module.exports = { sequelize };
