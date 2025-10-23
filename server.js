// ✅ Enable ES Modules in package.json: { "type": "module" }

import express from "express";
import fs from "fs";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3001;

// ✅ Resolve absolute path to avoid Windows/Linux path issues
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "students.json");

// ✅ Ensure data folder and file exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, JSON.stringify([]));
}

// ✅ Middleware
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

  try {
    const data = fs.readFileSync(DATA_FILE);
    const students = data.length ? JSON.parse(data) : [];

    const newStudent = {
      id: Date.now(),
      name,
      age,
      course,
      year,
      status: status || "active",
    };

    students.push(newStudent);

    fs.writeFileSync(DATA_FILE, JSON.stringify(students, null, 2));

    res.status(201).json(newStudent);
  } catch (error) {
    console.error("Error writing file:", error);
    res.status(500).json({ error: "Failed to add student." });
  }
});

// ✅ Task 2: Get all students (GET)
app.get("/api/students", (req, res) => {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return res.json([]);
    }

    const data = fs.readFileSync(DATA_FILE);
    const students = data.length ? JSON.parse(data) : [];
    res.json(students);
  } catch (error) {
    console.error("Error reading file:", error);
    res.status(500).json({ error: "Error reading students data." });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
