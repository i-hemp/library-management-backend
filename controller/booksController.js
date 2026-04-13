const { BooksData, pool } = require("../db");

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

exports.getAllBooks = async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM books ");
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

exports.getBookById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM books WHERE id = $1", [id]);

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
    await pool.query("BEGIN");
    
    // Check for overdue and calculate fine
    const issueResult = await pool.query(
      "SELECT due_date FROM book_issues WHERE student_id = $1 AND book_id = $2 AND return_date IS NULL",
      [student_id, id]
    );

    if (issueResult.rows.length === 0) {
      return res.status(404).send("Issue record not found");
    }

    const dueDate = new Date(issueResult.rows[0].due_date);
    const today = new Date();
    let fine = 0;
    
    if (today > dueDate) {
      const diffTime = Math.abs(today - dueDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      fine = diffDays * 1; // $1 per day
    }

    await pool.query(
      "UPDATE book_issues SET return_date = CURRENT_DATE, fine_amount = $1 WHERE student_id = $2 AND book_id = $3 AND return_date IS NULL",
      [fine, student_id, id]
    );
    await pool.query(
      "UPDATE books SET available_copies = available_copies + 1 WHERE id = $1",
      [id]
    );
    await pool.query("COMMIT");
    res.json({ message: "Book returned", fine_amount: fine });
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error(err);
    res.status(500).send(err.message);
  }
};

exports.getBookForIssueById = async (req, res) => {
  const { id, sid } = req.params;
  try {
    const bookById = await pool.query("SELECT available_copies FROM books WHERE id = $1", [id]);
    
    if (bookById.rows.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }
    if (bookById.rows[0].available_copies < 1)
      return res.status(400).send("No copies available");
    
    await pool.query("BEGIN");

    await pool.query(
      "INSERT INTO book_issues (student_id, book_id, issue_date, due_date) VALUES ($1, $2, CURRENT_DATE, CURRENT_DATE + INTERVAL '14 days')",
      [sid, id]
    );
    await pool.query(
      "UPDATE books SET available_copies = available_copies - 1 WHERE id = $1",
      [id]
    );
    
    await pool.query("COMMIT");
    res.send("Book issued");
  } catch (err) {
    console.log(err.message);
    await pool.query("ROLLBACK");
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
    // Check if a book with the same title already exists (case-insensitive)
    const existingBook = await pool.query(
      "SELECT * FROM books WHERE LOWER(title) = LOWER($1)",
      [title]
    );

    if (existingBook.rows.length > 0) {
      return res.status(400).json({
        error: "A book with this title already exists"
      });
    }

    // Insert the new book
    const result = await pool.query(
      "INSERT INTO books (title, author, available_copies, total_copies, price,category,isbn) VALUES ($1, $2, $3, $4, $5,$6,$7) RETURNING *",
      [title, author, available_copies, total_copies, price, category, isbn]
    );
    console.log(`Success:${result.rows}`);

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
    // Check if another book with the same title exists (excluding current book)
    const existingBook = await pool.query(
      "SELECT * FROM books WHERE LOWER(title) = LOWER($1) AND id != $2",
      [title, id]
    );

    if (existingBook.rows.length > 0) {
      return res.status(400).json({
        error: "A book with this title already exists"
      });
    }

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

exports.getStats = async (req, res, next) => {
  try {
    const totalBooks = await pool.query("SELECT COUNT(*) FROM books");
    const totalStudents = await pool.query("SELECT COUNT(*) FROM students");
    const activeIssues = await pool.query(
      "SELECT COUNT(*) FROM book_issues WHERE return_date IS NULL"
    );
    const overdueIssues = await pool.query(
      "SELECT COUNT(*) FROM book_issues WHERE return_date IS NULL AND due_date < CURRENT_DATE"
    );
    const categories = await pool.query(
      "SELECT category, COUNT(*) as count FROM books GROUP BY category"
    );

    const totalFines = await pool.query(
      "SELECT SUM(fine_amount) as total_fines FROM book_issues WHERE fine_status = 'pending'"
    );

    res.json({
      totalBooks: parseInt(totalBooks.rows[0].count),
      totalStudents: parseInt(totalStudents.rows[0].count),
      activeIssues: parseInt(activeIssues.rows[0].count),
      overdueIssues: parseInt(overdueIssues.rows[0].count),
      totalFines: parseFloat(totalFines.rows[0].total_fines || 0),
      categories: categories.rows.map(cat => ({
        ...cat,
        count: parseInt(cat.count)
      })),
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllFines = async (req, res, next) => {
  try {
    const result = await pool.query(`
      SELECT 
        bi.id, 
        bi.fine_amount, 
        bi.fine_status, 
        bi.issue_date, 
        bi.due_date, 
        bi.return_date,
        s.name as student_name, 
        s.roll_number,
        b.title as book_title
      FROM book_issues bi
      JOIN students s ON bi.student_id = s.id
      JOIN books b ON bi.book_id = b.id
      WHERE bi.fine_amount > 0
      ORDER BY bi.fine_status DESC, bi.due_date ASC
    `);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

exports.clearFine = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "UPDATE book_issues SET fine_status = 'paid' WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Fine record not found" });
    }
    res.json({ message: "Fine cleared successfully", record: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

