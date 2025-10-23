import express from "express";
import fs from "fs";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = "./data/students.json";

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Task 1: Add a new student (POST)
app.post("/api/students", (req, res) => {
  const { name, age, course, year, status } = req.body;

  // Validation
  if (!name || !course || !year) {
    return res.status(400).json({ error: "Name, course, and year are required." });
  }
  if (isNaN(age) || age <= 0) {
    return res.status(400).json({ error: "Age must be a number greater than 0." });
  }

  // Read existing data
  let students = [];
  if (fs.existsSync(DATA_FILE)) {
    const data = fs.readFileSync(DATA_FILE);
    students = JSON.parse(data);
  }

  // Create new student
  const newStudent = {
    id: Date.now(),
    name,
    age,
    course,
    year,
    status: status || "active"
  };

  students.push(newStudent);

  // Save to file
  fs.writeFileSync(DATA_FILE, JSON.stringify(students, null, 2));

  res.status(201).json(newStudent);
});

// ✅ Task 2: Get all students (GET)
app.get("/api/students", (req, res) => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return res.json([]);
    }

    const data = fs.readFileSync(DATA_FILE);
    const students = JSON.parse(data);
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: "Error reading students data." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});