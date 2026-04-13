const env = require("./config/env");
const express = require("express");
const cors = require("cors");
const booksRoutes = require("./routes/books"); 
const studentsRoutes = require("./routes/students");
const { errorHandler } = require("./middleware/errorMiddleware");

const app = express();

app.use(cors({
  origin: env.CORS_ORIGIN,
}));

app.use(express.json());

app.use("/api/students", studentsRoutes);
app.use("/api/books", booksRoutes);

// Global Error Handler
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`Server running in ${env.NODE_ENV} mode on port ${env.PORT}`);
});
