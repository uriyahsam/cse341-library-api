require('dotenv').config();
const mongoose = require('mongoose');
const Author = require('./models/Author');
const Book = require('./models/Book');
const Member = require('./models/Member');
const Loan = require('./models/Loan');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Author.deleteMany({});
    await Book.deleteMany({});
    await Member.deleteMany({});
    await Loan.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // ── AUTHORS ──────────────────────────────────────────────
    const authors = await Author.insertMany([
      {
        firstName: 'George',
        lastName: 'Orwell',
        nationality: 'British',
        birthYear: 1903,
        deathYear: 1950,
        genres: ['Dystopian', 'Political Fiction', 'Essays'],
        biography:
          'Eric Arthur Blair, known by his pen name George Orwell, was an English novelist and essayist known for his sharp criticism of totalitarianism and his support of democratic socialism.',
        email: 'george.orwell@library.com',
        website: 'https://georgeorwell.org'
      },
      {
        firstName: 'J.K.',
        lastName: 'Rowling',
        nationality: 'British',
        birthYear: 1965,
        genres: ['Fantasy', 'Mystery', "Children's Literature"],
        biography:
          'Joanne Rowling, known by her pen name J.K. Rowling, is a British author best known for writing the Harry Potter fantasy series, which has won multiple awards and sold over 500 million copies worldwide.',
        email: 'jk.rowling@library.com',
        website: 'https://jkrowling.com'
      },
      {
        firstName: 'Chinua',
        lastName: 'Achebe',
        nationality: 'Nigerian',
        birthYear: 1930,
        deathYear: 2013,
        genres: ['Literary Fiction', 'Post-colonial Literature', 'African Literature'],
        biography:
          'Chinua Achebe was a Nigerian novelist, poet, and critic regarded as the dominant figure of modern African literature. His debut novel Things Fall Apart is the most widely read book in modern African literature.',
        email: 'chinua.achebe@library.com',
        website: 'https://chinuaachebe.org'
      }
    ]);
    console.log(`📖 Created ${authors.length} authors`);

    // ── BOOKS ────────────────────────────────────────────────
    const books = await Book.insertMany([
      {
        title: 'Nineteen Eighty-Four',
        authorId: authors[0]._id,
        isbn: '978-0-452-28423-4',
        genre: 'Dystopian Fiction',
        publishedYear: 1949,
        totalCopies: 5,
        availableCopies: 3,
        description:
          'A dystopian novel set in a totalitarian society ruled by Big Brother, exploring themes of surveillance, propaganda, and the destruction of individual freedom.',
        coverImageUrl: 'https://covers.openlibrary.org/b/id/8575708-L.jpg'
      },
      {
        title: 'Animal Farm',
        authorId: authors[0]._id,
        isbn: '978-0-452-28424-1',
        genre: 'Political Satire',
        publishedYear: 1945,
        totalCopies: 4,
        availableCopies: 4,
        description:
          'An allegorical novella reflecting events leading up to the Russian Revolution and the Stalinist era of the Soviet Union.',
        coverImageUrl: 'https://covers.openlibrary.org/b/id/8291532-L.jpg'
      },
      {
        title: "Harry Potter and the Philosopher's Stone",
        authorId: authors[1]._id,
        isbn: '978-0-7475-3269-9',
        genre: 'Fantasy',
        publishedYear: 1997,
        totalCopies: 8,
        availableCopies: 5,
        description:
          'The first novel in the Harry Potter series, following a young wizard Harry Potter as he discovers his magical heritage and begins his education at Hogwarts School.',
        coverImageUrl: 'https://covers.openlibrary.org/b/id/10110415-L.jpg'
      },
      {
        title: 'Things Fall Apart',
        authorId: authors[2]._id,
        isbn: '978-0-385-47454-2',
        genre: 'Literary Fiction',
        publishedYear: 1958,
        totalCopies: 6,
        availableCopies: 6,
        description:
          'The story of Okonkwo, a leader and local wrestling champion in Umuofia, and the clash between his clan\'s traditions and the new colonial government and Christian missionaries.',
        coverImageUrl: 'https://covers.openlibrary.org/b/id/8739161-L.jpg'
      }
    ]);
    console.log(`📚 Created ${books.length} books`);

    // ── MEMBERS ──────────────────────────────────────────────
    const members = await Member.insertMany([
      {
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice.johnson@email.com',
        phone: '+1-555-0101',
        address: '456 Oak Avenue, Springfield, IL 62701',
        membershipType: 'premium',
        isActive: true
      },
      {
        firstName: 'Bob',
        lastName: 'Martinez',
        email: 'bob.martinez@email.com',
        phone: '+1-555-0202',
        address: '789 Pine Street, Shelbyville, IL 62565',
        membershipType: 'basic',
        isActive: true
      },
      {
        firstName: 'Clara',
        lastName: 'Mensah',
        email: 'clara.mensah@email.com',
        phone: '+233-555-0303',
        address: '12 Independence Ave, Accra, Ghana',
        membershipType: 'student',
        isActive: true
      }
    ]);
    console.log(`👥 Created ${members.length} members`);

    // ── LOANS ────────────────────────────────────────────────
    const loans = await Loan.insertMany([
      {
        bookId: books[0]._id,       // 1984
        memberId: members[0]._id,   // Alice
        loanDate: new Date('2026-05-01'),
        dueDate: new Date('2026-06-01'),
        returnDate: new Date('2026-05-28'),
        status: 'returned',
        notes: 'Returned early in good condition.'
      },
      {
        bookId: books[2]._id,       // Harry Potter
        memberId: members[1]._id,   // Bob
        loanDate: new Date('2026-06-01'),
        dueDate: new Date('2026-06-20'),
        status: 'active',
        notes: 'Summer reading program.'
      },
      {
        bookId: books[3]._id,       // Things Fall Apart
        memberId: members[2]._id,   // Clara
        loanDate: new Date('2026-05-20'),
        dueDate: new Date('2026-06-03'),
        status: 'overdue',
        notes: 'Member contacted — returning next week.'
      }
    ]);
    console.log(`🔖 Created ${loans.length} loans`);

    console.log('\n🎉 Database seeded successfully!\n');
    console.log('Summary:');
    console.log(`  Authors : ${authors.length}`);
    console.log(`  Books   : ${books.length}`);
    console.log(`  Members : ${members.length}`);
    console.log(`  Loans   : ${loans.length}`);

  } catch (err) {
    console.error('❌ Seed error:', err.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
};

seed();
