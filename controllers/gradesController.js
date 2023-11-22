const Grades = require("../models/Grades");

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

        // Check if the question with the given questionId exists
        const questionExists = await Question.exists({ _id: questionId });
        if (!questionExists) {
            return res.status(404).json({ error: "Question not found" });
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
