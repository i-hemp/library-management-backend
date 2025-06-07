const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:{
    rejectUnauthorized:false,
  }
  // user: 'hemanth',
  // host: 'localhost',
  // database: 'lib1',//!!!!!!!!!!!!!!!!!!!!!!!database not table name !!!!!!!!!!!!!!!!!!!!!!!!!!
  // password: '9699',
  // port: 5432,
});

// module.exports = pool;

/**
 *  id: 1,
    "name": "Clean Code",
    "author": "Robert C. Martin",
    "category": "Software Engineering",
    "total_copies": 10,
    "available_copies": 4,
  },
 */
const StudentsData=[
     {
    id: 2,
    name: "Bob Smith",
    roll_number: "ECE2023002",
    department: "Electronics",
    semester: "4",
    phone: "0987654321",
    email: "bob@example.com",
  },
]
const BooksData = [
  {
    id: 1,
    name: "Clean Code",
    author: "Robert C. Martin",
    isbn: "9780132350884",
    category: "Software Engineering",
    total_copies: 10,
    available_copies: 4,
  },
  {
    id: 2,
    name: "The Pragmatic Programmer",
    author: "Andrew Hunt",
    isbn: "9780201616224",
    category: "Programming",
    total_copies: 7,
    available_copies: 2,
  },
  {
    id: 3,
    name: "Design Patterns: Elements of Reusable Object-Oriented Software",
    author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
    isbn: "9780201633610",
    category: "Software Engineering",
    total_copies: 8,
    available_copies: 3,
  },
  {
    id: 4,
    name: "Introduction to Algorithms",
    author:
      "Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein",
    isbn: "9780262033848",
    category: "Computer Science",
    total_copies: 12,
    available_copies: 5,
  },
  {
    id: 5,
    name: "The Mythical Man-Month",
    author: "Frederick P. Brooks Jr.",
    isbn: "9780201835953",
    category: "Software Engineering",
    total_copies: 6,
    available_copies: 1,
  },
  {
    id: 6,
    name: "Code Complete",
    author: "Steve McConnell",
    isbn: "9780735619678",
    category: "Programming",
    total_copies: 9,
    available_copies: 6,
  },
  {
    id: 7,
    name: "Structure and Interpretation of Computer Programs",
    author: "Harold Abelson, Gerald Jay Sussman, Julie Sussman",
    isbn: "9780262510875",
    category: "Computer Science",
    total_copies: 5,
    available_copies: 2,
  },
  {
    id: 8,
    name: "Refactoring: Improving the Design of Existing Code",
    author: "Martin Fowler",
    isbn: "9780201485677",
    category: "Software Engineering",
    total_copies: 7,
    available_copies: 4,
  },
  {
    id: 9,
    name: "Artificial Intelligence: A Modern Approach",
    author: "Stuart Russell, Peter Norvig",
    isbn: "9780136042594",
    category: "Artificial Intelligence",
    total_copies: 10,
    available_copies: 7,
  },
  {
    id: 10,
    name: "The Clean Coder",
    author: "Robert C. Martin",
    isbn: "9780137081073",
    category: "Software Engineering",
    total_copies: 6,
    available_copies: 3,
  },
];
module.exports = { BooksData, pool ,StudentsData};
