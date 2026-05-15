const { bookResolvers } = require('./bookResolvers');
const { authorResolvers } = require('./authorResolvers');

const resolvers = {
  Query: {
    ...bookResolvers.Query,
    ...authorResolvers.Query,
  },
  Mutation: {
    ...bookResolvers.Mutation,
    ...authorResolvers.Mutation,
  },
  Book: bookResolvers.Book,
  Author: authorResolvers.Author,
};

module.exports = { resolvers };
