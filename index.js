const express = require("express");
const cors = require("cors");
const booksRoutes = require("./routes/books"); //need to make routes fo the endpoints
const studentsRoutes = require("./routes/students");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5001;

// library-api/
// ├── db.js
// ├── index.js
// ├── routes/
// │   └── books.js
// ├── controllers/
// │   └── booksController.js
// └── .env

app.use(cors(
  {
  origin:"https://librarypage443.netlify.app",
}
));
app.use(express.json());
app.use("/api/students", studentsRoutes);

app.use("/api/books", booksRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
