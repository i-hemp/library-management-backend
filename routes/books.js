const express = require("express");
const router = express.Router();
const booksController = require("../controller/booksController");

router.get("/", booksController.showHello); //example code
router.get("/show", booksController.showBooksSample); //example code
router.get("/data", booksController.showData); //example code
router.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ success: true, db_time: result.rows[0].now });
  } catch (err) {
    console.error("DB connection error:", err);
    res.status(500).json({ success: false, message: "DB Error", error: err.message });
  }
});
router.get("/all", booksController.getAllBooks); //r
router.get("/:id", booksController.getBookById); //r by id
router.get("/issue/logs/book/:id", booksController.bookIssueLog); //r by id
// router.get("/issue/logs/book/:book_id", booksController.getIssueLogsForBook);
router.post("/", booksController.createBook); //c
router.put("/put/:id", booksController.updateBook); //u
router.delete("/:id", booksController.deleteBook); //d
//issue routes
router.post("/issue/:id", booksController.getBookForIssueById); //r by id
// router.post("/return/:id", booksController.getBookForReturnById); //r by id
router.get("/students-issue", booksController.studentsBookHistory);
router.get("/issue/logs", booksController.issueLog);
router.get("/issue/logs/:id", booksController.getStudentIssueLog);
router.post("/return/:id", booksController.getBookForReturnById);

module.exports = router;
