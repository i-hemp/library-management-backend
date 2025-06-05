const express = require("express");
const router = express.Router();
const studentsController = require("../controller/studentsController");
//http://localhost:5001/api/students
router.get("/all", studentsController.getAll);
router.get('/:id',studentsController.getById);
router.put('/:id',studentsController.updateStudentById);
router.post('/',studentsController.createStudent);
router.delete('/:id',studentsController.deleteStudentById);
module.exports = router;
