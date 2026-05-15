const { Op } = require('sequelize');
const { Book, Author } = require('../../models');

const bookResolvers = {
  Query: {
    books: async (_, { page = 1, pageSize = 10, title, author_id, published_date_from, published_date_to, sortBy, sortOrder }) => {
      const where = {};
      if (title) where.title = { [Op.like]: `%${title}%` };
      if (author_id) where.author_id = author_id;
      if (published_date_from && published_date_to) {
        where.published_date = { [Op.between]: [published_date_from, published_date_to] };
      } else if (published_date_from) {
        where.published_date = { [Op.gte]: published_date_from };
      } else if (published_date_to) {
        where.published_date = { [Op.lte]: published_date_to };
      }

      const dir = sortOrder === 'DESC' ? 'DESC' : 'ASC';
      let order;
      if (sortBy === 'title') {
        order = [['title', dir]];
      } else if (sortBy === 'published_date') {
        order = [['published_date', dir]];
      } else if (sortBy === 'author_name') {
        order = [[{ model: Author, as: 'author' }, 'name', dir]];
      } else {
        order = [['createdAt', 'DESC']];
      }

      const offset = (page - 1) * pageSize;
      const { count, rows } = await Book.findAndCountAll({
        where,
        limit: pageSize,
        offset,
        include: [{ model: Author, as: 'author' }],
        order,
      });

      return {
        books: rows,
        total: count,
        page,
        pageSize,
        totalPages: Math.ceil(count / pageSize),
      };
    },

    book: async (_, { id }) =>
      Book.findByPk(id, { include: [{ model: Author, as: 'author' }] }),
  },

  Mutation: {
    createBook: async (_, args, { user }) => {
      if (!user) throw new Error('Authentication required');
      if (args.published_date && args.published_date > new Date().toISOString().slice(0, 10)) {
        throw new Error('Published date cannot be in the future');
      }
      if (args.author_id && user.role !== 'admin') {
        const author = await Author.findByPk(args.author_id);
        if (!author) throw new Error('Author not found');
        if (author.created_by !== user.uid) {
          throw new Error('You can only assign authors you have registered');
        }
      }
      return Book.create({ ...args, created_by: user.uid });
    },

    updateBook: async (_, { id, ...updates }, { user }) => {
      if (!user) throw new Error('Authentication required');
      const book = await Book.findByPk(id);
      if (!book) throw new Error('Book not found');
      if (user.role !== 'admin' && book.created_by !== user.uid) {
        throw new Error('You can only edit your own books');
      }
      if (updates.published_date && updates.published_date > new Date().toISOString().slice(0, 10)) {
        throw new Error('Published date cannot be in the future');
      }
      if (updates.author_id && user.role !== 'admin') {
        const author = await Author.findByPk(updates.author_id);
        if (!author) throw new Error('Author not found');
        if (author.created_by !== user.uid) {
          throw new Error('You can only assign authors you have registered');
        }
      }
      await book.update(updates);
      return Book.findByPk(id, { include: [{ model: Author, as: 'author' }] });
    },

    deleteBook: async (_, { id }, { user }) => {
      if (!user) throw new Error('Authentication required');
      const book = await Book.findByPk(id);
      if (!book) throw new Error('Book not found');
      if (user.role !== 'admin' && book.created_by !== user.uid) {
        throw new Error('You can only delete your own books');
      }
      await book.destroy();
      return true;
    },
  },

  Book: {
    author: async (book) => {
      if (book.author) return book.author;
      if (!book.author_id) return null;
      return Author.findByPk(book.author_id);
    },
  },
};

module.exports = { bookResolvers };
