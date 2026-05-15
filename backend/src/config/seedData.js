const { Author, Book } = require('../models');

async function seedIfEmpty() {
  const count = await Author.count();
  if (count > 0) return;

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
    {
      name: 'Harper Lee',
      biography: 'American novelist widely known for To Kill a Mockingbird.',
      born_date: '1926-04-28',
    },
    {
      name: 'J.R.R. Tolkien',
      biography: 'English author and philologist, creator of Middle-earth.',
      born_date: '1892-01-03',
    },
  ]);

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
    {
      title: 'To Kill a Mockingbird',
      description: 'A story of racial injustice and childhood innocence in the American South.',
      published_date: '1960-07-11',
      author_id: authors[3].id,
    },
    {
      title: 'The Lord of the Rings: The Fellowship of the Ring',
      description: 'A hobbit begins an epic quest to destroy a powerful ring.',
      published_date: '1954-07-29',
      author_id: authors[4].id,
    },
    {
      title: 'The Hobbit',
      description: 'Bilbo Baggins is swept into an epic quest to reclaim a lost dwarf kingdom.',
      published_date: '1937-09-21',
      author_id: authors[4].id,
    },
  ]);

  console.log(`Seeded ${authors.length} authors and 8 books`);
}

module.exports = { seedIfEmpty };
