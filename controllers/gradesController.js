const Grades = require("../models/Grades");
const User = require("../models/User");
const { mongoose } = require("mongoose");

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

        let kanjiGrades, vocabGrades, grammarGrades;
        if (grades.length > 0) {
            kanjiGrades = grades
                .map((kanji) => kanji.questionSetId.includes("kanji") && kanji)
                .filter((kanji) => kanji);

            vocabGrades = grades
                .map((vocab) => vocab.questionSetId.includes("vocab") && vocab)
                .filter((vocab) => vocab);

            grammarGrades = grades
                .map(
                    (grammar) =>
                        grammar.questionSetId.includes("grammar") && grammar
                )
                .filter((grammar) => grammar);
        }
        // I will just comment this out because if there is no grade it means that the this set is not graded yet so it will return empty object
        // if (grades.length < 1)
        //     return res.status(404).json({ error: "No grades found" });

        res.status(200).json({ kanjiGrades, vocabGrades, grammarGrades });
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

        // I will just comment this out because if there is no grade it means that the this set is not graded yet so it will return empty object
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
            (score < 0 && !score) ||
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

const getTotalScoresAndItems = async (req, res) => {
    // set the userId back to ObjectId
    const userId = new mongoose.Types.ObjectId(req.body.userId);
    try {
        if (!userId)
            return res.status(400).json({ error: "userId is missing" });

        const scoresAndNumOfItems = await Grades.aggregate([
            {
                $addFields: {
                    truncatedQuestionSetId: {
                        $substr: [
                            "$questionSetId",
                            0,
                            { $subtract: [{ $strLenCP: "$questionSetId" }, 1] },
                        ],
                    },
                },
            },
            {
                $match: {
                    userId,
                    truncatedQuestionSetId: { $not: { $regex: /\d$/ } }, // Exclude if the last character is a number
                },
            },
            {
                $group: {
                    _id: {
                        userId: "$userId",
                        questionSetId: "$truncatedQuestionSetId",
                    },
                    totalScore: { $sum: "$score" },
                    totalItems: { $sum: { $size: "$idPerQuestion" } },
                },
            },
        ]);

        res.status(200).json(scoresAndNumOfItems);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

const deleteGradesByQuestionSetId = async (req, res) => {
    const { questionSetId } = req.body;
    try {
        const deletedGrades = await Grades.deleteMany({
            questionSetId,
        });

        if (deletedGrades.deletedCount < 1)
            return res.status(404).json({
                error: `No Grades Found with Question Set Id: '${questionSetId}'`,
            });

        res.status(200).json(deletedGrades);
    } catch (error) {
        res.status(400).json(error.message);
    }
};

module.exports = {
    getAllGrades,
    getGrades,
    getSpicificGrades,
    getTotalScoresAndItems,
    addGrades,
    deleteGradesByQuestionSetId,
};
