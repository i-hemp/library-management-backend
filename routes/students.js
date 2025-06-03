const express = require("express");
const router = express.Router();
const studentsController = require("../controller/studentsController");

router.get("/all", studentsController.getAll);
module.exports = router;
