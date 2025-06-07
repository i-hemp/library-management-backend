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
exports.getStudentIssueLog = async (req, res) => {
  const { id } = req.params;
  console.log(id);

  try {
    const result = await pool.query(
      "SELECT * FROM book_issues WHERE student_id = $1",
      [id]
    );
    console.log(result.rows);

    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// exports.getBookForReturnById = async (req, res) => {
//   const { id } = req.params;
//   const { student_id } = req.body;
// console.log(id+" "+student_id);

//   try {
//     const issue = await pool.query(
//       "SELECT * FROM book_issues WHERE book_id = $1 AND student_id = $2 AND return_date IS NULL",
//       [id, student_id]
//     );
//     console.log(issue.rows);

//     if (issue.rowCount === 0) {
//       return res.status(404).json({ error: "No active issue found for this student and book" });
//     }

//     await pool.query(
//       "UPDATE book_issues SET return_date = CURRENT_DATE WHERE book_id = $1 AND student_id = $2 AND return_date IS NULL",
//       [id, student_id]
//     );

//     await pool.query(
//       "UPDATE books SET available_copies = available_copies + 1 WHERE id = $1",
//       [id]
//     );

//     res.status(200).json({ message: "Book returned successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

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

  const { id,sid } = req.params;
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
exports.studentsBookHistory = async (req, res) => {
  //not used!!!!!!!!!!!!!!!
  const { identifier } = req.query;
  try {
    const result = await db.query(
      `
      SELECT b.title, b.author, bi.issue_date, bi.due_date
      FROM book_issues bi
      JOIN books b ON bi.book_id = b.id
      JOIN students s ON bi.student_id = s.id
      WHERE (s.name = $1 OR s.roll_number = $1 OR CAST(s.phone AS TEXT) = $1)
        AND bi.return_date IS NULL`,
      [identifier]
    );
    res.json(result.rows);
  } catch (err) {
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
    console.log(
      title,
      author,
      available_copies,
      total_copies,
      price,
      category,
      isbn
    );
    console.log("\n"+result.rows);
    

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
