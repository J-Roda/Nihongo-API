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
        const { userId, questionSetId } = req.body;

        if (!userId || !questionSetId)
            return res.status(400).json({
                error: `Missing required fields: userId, questionId`,
            });

        const userExists = await User.exists({ _id: userId });

        if (!userExists)
            return res.status(404).json({ error: "User not found" });

        const grade = await Grades.findOne({ userId, questionSetId });

        // I will just comment this out because if there is no grade it means that the this set is not graded yet so it will return nothing
        // if (!grade) return res.status(404).json({ error: "Grade not found" });

        res.status(200).json(grade);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const addGrades = async (req, res) => {
    try {
        const { userId, questionSetId, idPerQuestion, userAnswers, score } =
            req.body;

        // // We need to sort the idPerQuestion together with userAnswers so that it will be in synchronized
        // // in order to do that we need to combine first the 2 arrays
        // const combinedArray = idPerQuestion.map((questionId, index) => [
        //     questionId,
        //     userAnswers[index],
        // ]);

        // // Sort the 2D array based on the first column (questionIds)
        // // we need to sort the userAnswers together with questions because the API returns a sorted questions which is by questionId
        // const sortedArray = combinedArray.sort((a, b) =>
        //     a[0].localeCompare(b[0])
        // );

        // // Get back the userAnswers which are now sorted where every questions option, the userAnswers are one of them
        // const sortedUserAnswers = sortedArray.map(
        //     ([questionId, userAnswer]) => userAnswer
        // );

        // Validate that required fields are provided
        if (
            !userId ||
            !questionSetId ||
            !score ||
            !idPerQuestion ||
            !userAnswers
        ) {
            return res
                .status(400)
                .json({ error: `Missing required fields: ${req.body}` });
        }

        // Check if the user with the given userId exists
        const userExists = await User.exists({ _id: userId });
        if (!userExists) {
            return res.status(404).json({ error: "User not found" });
        }
        // Check if this set is already graded with the given userId and questionSetId
        const isGraded = await Grades.exists({ userId, questionSetId });
        if (isGraded) {
            const updatedGrade = await Grades.findOneAndUpdate(
                {
                    userId,
                    questionSetId,
                },
                {
                    $set: {
                        score,
                        idPerQuestion,
                        userAnswers,
                    },
                },
                { new: true } // To return the modified document instead of the original
            );
            return res.status(200).json(updatedGrade);
        }

        // Create a new grade entry
        const newGrade = new Grades({
            userId,
            questionSetId,
            idPerQuestion,
            userAnswers,
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
