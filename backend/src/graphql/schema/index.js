const typeDefs = `#graphql
  type Author {
    id: ID!
    name: String!
    biography: String
    born_date: String
    photo: String
    created_by: String
    books: [Book]
    createdAt: String
    updatedAt: String
  }

  type Book {
    id: ID!
    title: String!
    description: String
    published_date: String
    cover_image: String
    author_id: ID
    author: Author
    created_by: String
    createdAt: String
    updatedAt: String
  }

  type BookPagination {
    books: [Book!]!
    total: Int!
    page: Int!
    pageSize: Int!
    totalPages: Int!
  }

  type AuthorPagination {
    authors: [Author!]!
    total: Int!
    page: Int!
    pageSize: Int!
    totalPages: Int!
  }

  type Query {
    books(
      page: Int
      pageSize: Int
      title: String
      author_id: ID
      published_date_from: String
      published_date_to: String
      sortBy: String
      sortOrder: String
    ): BookPagination!

    book(id: ID!): Book

    authors(
      page: Int
      pageSize: Int
      name: String
      birth_year: Int
      created_by: String
      sortBy: String
      sortOrder: String
    ): AuthorPagination!

    author(id: ID!): Author
  }

  type Mutation {
    createBook(
      title: String!
      description: String
      published_date: String
      cover_image: String
      author_id: ID
    ): Book!

    updateBook(
      id: ID!
      title: String
      description: String
      published_date: String
      cover_image: String
      author_id: ID
    ): Book!

    deleteBook(id: ID!): Boolean!

    createAuthor(
      name: String!
      biography: String
      born_date: String
      photo: String
    ): Author!

    updateAuthor(
      id: ID!
      name: String
      biography: String
      born_date: String
      photo: String
    ): Author!

    deleteAuthor(id: ID!): Boolean!
  }
`;

module.exports = { typeDefs };
