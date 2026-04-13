const { z } = require('zod');

const bookSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  author: z.string().min(1, "Author is required").max(100),
  isbn: z.string().min(10, "ISBN must be at least 10 characters").max(20),
  category: z.string().min(1, "Category is required"),
  total_copies: z.number().int().nonnegative("Total copies must be 0 or more"),
  available_copies: z.number().int().nonnegative("Available copies must be 0 or more"),
  price: z.number().nonnegative("Price must be 0 or more"),
});

const studentSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  roll_number: z.string().min(1, "Roll number is required"),
  department: z.string().min(1, "Department is required"),
  semester: z.string().min(1, "Semester is required"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  email: z.string().email("Invalid email address"),
});

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    return res.status(400).json({ error: error.errors[0].message });
  }
};

module.exports = {
  bookSchema,
  studentSchema,
  validate
};
