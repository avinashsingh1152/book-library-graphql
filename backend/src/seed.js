require('dotenv').config();
const { sequelize } = require('./config/database');
const { Author, Book } = require('./models');

async function seed() {
  await sequelize.sync({ force: true });
  console.log('Database reset and synced');

  const authors = await Author.bulkCreate([
    {
      name: 'George Orwell',
      biography: 'English novelist and essayist known for his works on totalitarianism.',
      born_date: '1903-06-25',
    },
    {
      name: 'J.K. Rowling',
      biography: 'British author best known for the Harry Potter fantasy series.',
      born_date: '1965-07-31',
    },
    {
      name: 'F. Scott Fitzgerald',
      biography: 'American novelist of the Jazz Age, known for The Great Gatsby.',
      born_date: '1896-09-24',
    },
  ]);

  console.log(`Created ${authors.length} authors`);

  await Book.bulkCreate([
    {
      title: '1984',
      description: 'A dystopian novel set in a totalitarian society under constant surveillance.',
      published_date: '1949-06-08',
      author_id: authors[0].id,
    },
    {
      title: 'Animal Farm',
      description: 'An allegorical novella reflecting the events leading up to the Russian Revolution.',
      published_date: '1945-08-17',
      author_id: authors[0].id,
    },
    {
      title: "Harry Potter and the Philosopher's Stone",
      description: 'A young boy discovers he is a wizard and begins his education at Hogwarts.',
      published_date: '1997-06-26',
      author_id: authors[1].id,
    },
    {
      title: 'Harry Potter and the Chamber of Secrets',
      description: "Harry's second year at Hogwarts brings new dangers and mysteries.",
      published_date: '1998-07-02',
      author_id: authors[1].id,
    },
    {
      title: 'The Great Gatsby',
      description: 'A story of wealth, love, and the American Dream in the Jazz Age.',
      published_date: '1925-04-10',
      author_id: authors[2].id,
    },
  ]);

  console.log('Created 5 books');
  console.log('Seed complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
