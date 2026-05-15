const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Book = sequelize.define('Book', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  published_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  author_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'authors', key: 'id' },
  },
  cover_image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  created_by: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'books',
  timestamps: true,
});

module.exports = Book;
