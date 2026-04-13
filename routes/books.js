const express = require("express");
const router = express.Router();
const { pool } = require("../db");

const booksController = require("../controller/booksController");
const { bookSchema, validate } = require("../middleware/validation");
//http://localhost:5001/api/books

//dummies
router.get("/", booksController.showHello); 
router.get("/show", booksController.showBooksSample); 
router.get("/data", booksController.showData); 
router.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ success: true, db_time: result.rows[0].now });
  } catch (err) {
    console.error("DB connection error:", err);
    res.status(500).json({ success: false, message: "DB Error", error: err.message });
  }
});
//main route
router.get("/all", booksController.getAllBooks); //r
router.get("/:id", booksController.getBookById); //r by id
router.get("/issue/logs/book/:id", booksController.bookIssueLog); //r by id
router.post("/", validate(bookSchema), booksController.createBook); //c
router.put("/put/:id", validate(bookSchema), booksController.updateBook); //u
router.delete("/:id", booksController.deleteBook); //d
//issue routes
router.post("/issue/:id/:sid", booksController.getBookForIssueById); //r by id
router.get("/issue/logs", booksController.issueLog);
router.get("/issue/logs/:id", booksController.getStudentIssueLog);
router.post("/return/:id", booksController.getBookForReturnById);
router.get("/stats/all", booksController.getStats);
router.get("/fines/all", booksController.getAllFines);
router.post("/fines/pay/:id", booksController.clearFine);

module.exports = router;
