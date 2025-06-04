const express = require("express");
const router = express.Router();
const studentsController = require("../controller/studentsController");
//http://localhost:5001/api/students
router.get("/all", studentsController.getAll);
router.post('/',studentsController.createStudent);
module.exports = router;
