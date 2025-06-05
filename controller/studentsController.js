const { StudentsData, pool } = require("../db");
//http://localhost:5001/api/students
exports.getAll = async (req, res) => {
  try {
    const result = await pool.query("select * from students");

    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error happened!" });
  }
};
exports.updateStudentById = async (req, res) => {
  const { id } = req.params;
  const { name, roll_number, department, semester, phone, email } = req.body;
  console.log(name, roll_number, department, semester, phone, email ,id);
  
  try {
    const result = await pool.query(
      `UPDATE students SET name = $1, roll_number = $2, department = $3, semester = $4, phone = $5, email = $6 WHERE id = $7 RETURNING *`,
      [name, roll_number, department, semester, phone, email, id]
    );

    if (result.rows.length === 0) {
      //not table , only the resultant array will store in result with js object styled values
      return res.status(404).json({ message: "Student not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`select * from students where id=${id}`);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.createStudent = async (req, res) => {
  const { name, roll_number, department, semester, phone, email } = req.body;
  console.log(req.body); // this should now log the correct object

  try {
    const result = await pool.query(
      "INSERT INTO students (roll_number , name , department , semester , phone , email) VALUES ($1, $2, $3, $4, $5 , $6) RETURNING *",
      [roll_number, name, department, semester, phone, email]
    );
    console.log(`Success: ${result.rows}`);

    res.status(201).json(result.rows);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: err.message });
  }
};
exports.deleteStudentById = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM students WHERE id = $1", [id]);

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
