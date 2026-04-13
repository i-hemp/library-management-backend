const express = require("express");
const router = express.Router();
const studentsController = require("../controller/studentsController");
const { studentSchema, validate } = require("../middleware/validation");
//http://localhost:5001/api/students
router.get("/all", studentsController.getAll);
router.get('/:id',studentsController.getById);
router.put('/:id', validate(studentSchema), studentsController.updateStudentById);
router.post('/', validate(studentSchema), studentsController.createStudent);
router.delete('/:id',studentsController.deleteStudentById);
module.exports = router;
