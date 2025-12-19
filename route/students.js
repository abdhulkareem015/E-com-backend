const express = require("express");
const Student = require("../models/Student");
const getAllStudents = require("../controller/StudentController");
const router = express.Router();

router.get("/", getAllStudents);

router.post("/", async (req, res) => {
    try {
        const { name, age, roll_no, class: std } = req.body;
        const student = await Student.create({ name, age, roll_no, class: std });
        res.status(201).json({ message: "Student created successfully", student });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;