const { Op } = require('sequelize');
const { Author, Book } = require('../../models');

const authorResolvers = {
  Query: {
    authors: async (_, { page = 1, pageSize = 10, name, birth_year, created_by, sortBy, sortOrder }) => {
      const where = {};
      if (name) where.name = { [Op.like]: `%${name}%` };
      if (created_by) where.created_by = created_by;
      if (birth_year) {
        where.born_date = {
          [Op.between]: [`${birth_year}-01-01`, `${birth_year}-12-31`],
        };
      }

      const dir = sortOrder === 'DESC' ? 'DESC' : 'ASC';
      const order = sortBy === 'born_date' ? [['born_date', dir]] : [['name', dir]];

      const offset = (page - 1) * pageSize;
      const { count, rows } = await Author.findAndCountAll({
        where,
        limit: pageSize,
        offset,
        order,
      });

      return {
        authors: rows,
        total: count,
        page,
        pageSize,
        totalPages: Math.ceil(count / pageSize),
      };
    },

    author: async (_, { id }) =>
      Author.findByPk(id, { include: [{ model: Book, as: 'books' }] }),
  },

  Mutation: {
    createAuthor: async (_, args, { user }) => {
      if (!user) throw new Error('Authentication required');
      return Author.create({ ...args, created_by: user.uid });
    },

    updateAuthor: async (_, { id, ...updates }, { user }) => {
      if (!user) throw new Error('Authentication required');
      const author = await Author.findByPk(id);
      if (!author) throw new Error('Author not found');
      if (user.role !== 'admin' && author.created_by !== user.uid) {
        throw new Error('You can only edit your own authors');
      }
      await author.update(updates);
      return Author.findByPk(id, { include: [{ model: Book, as: 'books' }] });
    },

    deleteAuthor: async (_, { id }, { user }) => {
      if (!user) throw new Error('Authentication required');
      const author = await Author.findByPk(id);
      if (!author) throw new Error('Author not found');
      if (user.role !== 'admin' && author.created_by !== user.uid) {
        throw new Error('You can only delete your own authors');
      }
      await author.destroy();
      return true;
    },
  },

  Author: {
    books: async (author) => {
      if (author.books) return author.books;
      return Book.findAll({ where: { author_id: author.id } });
    },
  },
};

module.exports = { authorResolvers };
