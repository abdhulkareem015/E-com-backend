const Student = require("../models/Student");

const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find();
        if (students && students.length) {
            res.status(200).json(students);
        } else {
            res.status(404).json({ error: "Students not found" });
        }
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = getAllStudents;