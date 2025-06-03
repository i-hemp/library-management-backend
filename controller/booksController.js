// const BooksData = require("../db");
const { BooksData, pool } = require("../db");
var x = 0;
// router.get("/", .showHello); //example code
// router.get("/show", .showBooksSample); //example code
// router.get("/data", .showData); //example code
// router.get("/all", .getAllBooks); //r
// router.get("/:id", .getBookById); //r by id
// router.post("/", .createBook); //c
// router.put("/:id", .updateBook); //u
// router.delete("/:id", .deleteBook); //d
// if (name && typeof name === 'string' && name.trim() !== '') {
// { "name": "Clean Code",
//     "author": "Robert C. Martin",
//     "category": "Software Engineering",
//     "total_copies": 10,
//     "available_copies": 4,
// }
//shows hello
exports.showHello = async (req, res) => {
  res.status(200).send(`Hello from showHello ${x++}`);
};
//shows hardcode data
exports.showData = async (req, res) => {
  res.status(200);
  res.json(BooksData);
};
exports.showBooksSample = async (req, res) => {
  try {
    const result = await pool.query("select * from books");
    // res.json(result.rows)
    console.log("Command:", result.command);
    console.log("OID:", result.oid);
    console.log("Row Count:", result.rowCount);
    console.log("Rows:", result.rows);
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "error happended!" });
  }
};

exports.getAllBooks = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM books ");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBookById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`SELECT * FROM books WHERE id = ${id}`);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.log(err.message);
    
    res.status(500).json({ error: err.message });
  }
};
exports.getBookForIssueById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`SELECT available_copies FROM books WHERE id = ${id}`);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.log(err.message);
    
    res.status(500).json({ error: err.message });
  }
};


exports.createBook = async (req, res) => {
  const {
    name,
    author,
    available_copies,
    total_copies,
    price,
    category,
    isbn,
  } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO books (name, author, available_copies, total_copies, price,category,isbn) VALUES ($1, $2, $3, $4, $5,$6,$7) RETURNING *",
      [name, author, available_copies, total_copies, price, category, isbn]
    );
    res.status(201).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateBook = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    author,
    available_copies,
    total_copies,
    price,
    category,
    isbn,
  } = req.body;
  try {
    const result = await pool.query(
      "UPDATE books SET name = $1, author = $2, available_copies = $3, total_copies = $4, price = $5, category = $6,isbn = $7 WHERE id = $8 RETURNING *",
      [name, author, available_copies, total_copies, price, category, isbn, id]
    );
    if (result.rows.length === 0) {
      //not table only the resultant array will store in result with js object styled values
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM books WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
