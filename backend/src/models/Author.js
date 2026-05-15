const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Author = sequelize.define('Author', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true },
  },
  biography: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  born_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  photo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  created_by: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'authors',
  timestamps: true,
});

module.exports = Author;
