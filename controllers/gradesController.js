const Grades = require("../models/Grades");
const User = require("../models/User");

const getAllGrades = async (req, res) => {
    try {
        const grades = await Grades.find();

        if (grades.length < 1)
            return res.status(404).json({ error: "No grades Found" });

        res.status(200).json(grades);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// get grades by user
const getGrades = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId)
            return res.status(400).json({ error: "Missing required fields" });

        // Check if the user with the given userId exists
        const userExists = await User.exists({ _id: userId });
        if (!userExists) {
            return res.status(404).json({ error: "User not found" });
        }

        const grades = await Grades.find({ userId });

        if (grades.length < 1)
            return res.status(404).json({ error: "No grades found" });

        res.status(200).json(grades);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getSpicificGrades = async (req, res) => {
    try {
        const { userId, questionId } = req.body;

        if (!userId || !questionId)
            return res.status(400).json({
                error: `Missing required fields: userId, questionId`,
            });

        const userExists = await User.exists({ _id: userId });

        if (!userExists)
            return res.status(404).json({ error: "User not found" });

        const grade = await Grades.findOne({ userId, questionId });

        if (!grade) return res.status(404).json({ error: "Grade not found" });

        res.status(200).json(grade);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const addGrades = async (req, res) => {
    try {
        const { userId, questionId, score } = req.body;

        // Validate that required fields are provided
        if (!userId || !questionId || !score) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Check if the user with the given userId exists
        const userExists = await User.exists({ _id: userId });
        if (!userExists) {
            return res.status(404).json({ error: "User not found" });
        }
        // Check if this set is already graded with the given userId and questionId
        const isGraded = await Grades.exists({ userId, questionId });
        if (isGraded) {
            const updatedGrade = await Grades.findOneAndUpdate(
                {
                    userId,
                    questionId,
                },
                {
                    $set: { score: score },
                },
                { new: true } // To return the modified document instead of the original
            );
            return res.status(200).json(updatedGrade);
        }

        // Create a new grade entry
        const newGrade = new Grades({
            userId,
            questionId,
            score,
        });

        // Save the new grade entry to the database
        await newGrade.save();

        return res
            .status(201)
            .json({ success: true, message: "Grade added successfully" });
    } catch (error) {
        res.status(400).json({
            error: `Error adding grades: ${error.message}`,
        });
    }
};

module.exports = {
    getAllGrades,
    getGrades,
    getSpicificGrades,
    addGrades,
};
