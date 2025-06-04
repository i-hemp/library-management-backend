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
exports.createStudent = async (req, res) => {
  const { name, roll_number, department, semester, phone, email } = req.body;
  console.log(req.body);  // this should now log the correct object

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
