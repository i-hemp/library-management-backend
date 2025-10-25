const express = require("express");
const cors = require("cors");
const booksRoutes = require("./routes/books"); 
const studentsRoutes = require("./routes/students");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5001;


app.use(cors(
  {
  origin:["https://library-management-frontend-kohl.vercel.app","http://localhost:3000"],
}
));
app.use(express.json());
app.use("/api/students", studentsRoutes);

app.use("/api/books", booksRoutes);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
