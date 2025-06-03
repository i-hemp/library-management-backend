const { StudentsData, pool } = require("../db");

exports.getAll = async (req, res) => {
  try {
    const result = await pool.query("select * from students");

    res.json(result.rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error happened!" });
  }
};
