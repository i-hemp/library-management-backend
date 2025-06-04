const express = require("express");
const router = express.Router();
const booksController = require("../controller/booksController");

router.get("/", booksController.showHello); //example code
router.get("/show", booksController.showBooksSample); //example code
router.get("/data", booksController.showData); //example code

router.get("/all", booksController.getAllBooks); //r
router.get("/:id", booksController.getBookById); //r by id
router.post("/", booksController.createBook); //c
router.put("/:id", booksController.updateBook); //u
router.delete("/:id", booksController.deleteBook); //d
//issue routes
router.post("/issue/:id", booksController.getBookForIssueById); //r by id
router.post("/return/:id", booksController.getBookForReturnById); //r by id
router.get("students-issue", booksController.studentsBookHistory);
module.exports = router;
