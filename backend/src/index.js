const createApp = require('./app');

async function startServer() {
  const app = await createApp();
  const PORT = process.env.APP_PORT || 4000;
  app.listen(PORT, () => {
    console.log(`GraphQL server ready at http://localhost:${PORT}/graphql`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
