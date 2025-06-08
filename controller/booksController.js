const { BooksData, pool } = require("../db");
var x = 0;

exports.bookIssueLog = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM book_issues WHERE book_id = $1 ",
      [req.params.id]
    );

    console.log(result.rows);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.issueLog = async (req, res) => {
  try {
    const result = await pool.query("select * from book_issues");
    console.log(result.rows);
    if (result.rowCount < 1) console.log("no rows");

    res.json(result.rows);
  } catch (err) {
    console.log(err);

    res.status(500).json({ error: err.message });
  }
};
//shows hello
exports.showHello = async (req, res) => {
  res.status(200).send(`Hello from showHello ${x++}`);
};
//shows HCode data
exports.showData = async (req, res) => {
  res.status(200);
  res.json(BooksData);
};
exports.showBooksSample = async (req, res) => {
  try {
    const result = await pool.query("select * from books");
    // res.json(result.rows)
    // console.log("Command:", result.command);
    // console.log("OID:", result.oid);
    // console.log("Row Count:", result.rowCount);
    // console.log("Rows:", result.rows);
    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "error happended!" });
  }
};
exports.getStudentIssueLog = async (req, res) => {
  const { id } = req.params;
  // console.log(id);

  try {
    const result = await pool.query(
      "SELECT * FROM book_issues WHERE student_id = $1",
      [id]
    );
    // console.log(result.rows);

    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
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

exports.getBookForReturnById = async (req, res) => {
  const { id } = req.params;
  const { student_id } = req.body;
  console.log(`bid:${id}:::sid:${student_id}`);

  try {
    await pool.query("begin");
    await pool.query(
      "UPDATE book_issues SET return_date = CURRENT_DATE WHERE student_id = $1 AND book_id = $2 AND return_date IS NULL",
      [student_id, id]
    );
    await pool.query(
      "UPDATE books SET available_copies = available_copies + 1 WHERE id = $1",
      [id]
    );
    await pool.query("COMMIT");
    res.send("Book returned");
  } catch (err) {
    await pool.query("ROLLBACK");
    res.status(500).send(err.message);
  }
};

exports.getBookForIssueById = async (req, res) => {
  const { id, sid } = req.params;
  try {
    const bookById =
      await pool.query(`SELECT available_copies FROM books WHERE id = ${id};
        `);
    if (bookById.rows.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }
    if (bookById.rows[0].available_copies < 1)
      return res.status(400).send("No copies available");
    // res.json(result.rows[0]);
    await pool.query("Begin");

    await pool.query(`INSERT INTO book_issues (student_id, book_id, issue_date, due_date)
                VALUES (${sid}, ${id}, CURRENT_DATE, CURRENT_DATE + INTERVAL '14 days');
                UPDATE books SET available_copies = available_copies - 1 WHERE id = ${id};`);
    await pool.query("Commit");
    res.send("Book issued");
  } catch (err) {
    console.log(err.message);
    await pool.query("rollback");
    res.status(500).send(err.message);
  }
};

exports.createBook = async (req, res) => {
  const {
    title,
    author,
    available_copies,
    total_copies,
    price,
    category,
    isbn,
  } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO books (title, author, available_copies, total_copies, price,category,isbn) VALUES ($1, $2, $3, $4, $5,$6,$7) RETURNING *",
      [title, author, available_copies, total_copies, price, category, isbn]
    );
    console.log(`Sucess:${result.rows}`);

    res.status(201).json(result.rows);
  } catch (err) {
    console.log(err.message);

    res.status(500).json({ error: err.message });
  }
};

exports.updateBook = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    author,
    available_copies,
    total_copies,
    price,
    category,
    isbn,
  } = req.body;
  try {
    const result = await pool.query(
      "UPDATE books SET title = $1, author = $2, available_copies = $3, total_copies = $4, price = $5, category = $6,isbn = $7 WHERE id = $8 RETURNING *",
      [title, author, available_copies, total_copies, price, category, isbn, id]
    );
    // console.log(
    //   title,
    //   author,
    //   available_copies,
    //   total_copies,
    //   price,
    //   category,
    //   isbn
    // );
    // console.log("\n" + result.rows);

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
