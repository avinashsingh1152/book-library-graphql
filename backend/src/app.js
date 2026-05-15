require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { json } = require('body-parser');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');

const { typeDefs } = require('./graphql/schema');
const { resolvers } = require('./graphql/resolvers');
const { sequelize } = require('./config/database');
const { verifyToken } = require('./middleware/auth');
const { createAdminUser } = require('./config/initAdmin');
const { seedIfEmpty } = require('./config/seedData');

require('./models');

async function createApp() {
  await sequelize.sync({ alter: true });
  console.log('SQLite database synced');

  await seedIfEmpty();
  await createAdminUser();

  const app = express();

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();

  const allowedOrigins = [
    process.env.CLIENT_URL || 'http://localhost:3000',
    'https://book-libr-app-graphql.web.app',
    'https://book-libr-app-graphql.firebaseapp.com',
  ];
  const corsOptions = {
    origin: (origin, cb) => cb(null, !origin || allowedOrigins.includes(origin)),
    credentials: true,
  };

  app.use(
    '/graphql',
    cors(corsOptions),
    json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const authHeader = req.headers.authorization || '';
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
        const user = token ? await verifyToken(token) : null;
        return { user };
      },
    })
  );

  return app;
}

module.exports = createApp;
