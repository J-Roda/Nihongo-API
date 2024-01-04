const { json } = require("express");
const { decode } = require("../auth");
const Questions = require("../models/Questions");
const Grades = require("../models/Grades");

// get all questions
const getAllQuestions = async (req, res) => {
    try {
        const questions = await Questions.find();

        if (questions.length < 1)
            return res.status(404).json({ error: "No Questions Found!" });

        res.status(200).json(questions);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
// get questions depending on type and level
const getQuestionsByTypeLevel = async (req, res) => {
    const { type, level } = req.params;

    try {
        if (!type || !level) throw Error("Type or Level is Empty!");
        const question = await Questions.find({ type: type, level: level });

        if (question.length < 1)
            return res.status(404).json({ error: "No such question exist!" });

        res.status(200).json(question);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getQuestionByType = async (req, res) => {
    const { type } = req.params;

    try {
        if (!type) throw Error("Type is empty!");

        const question = await Questions.find({ type: type });

        if (question.length < 1)
            return res.status(404).json({ error: "No such question exist!" });

        res.status(200).json(question);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// get questions by set, type, and level
const getQuestionCountByTypeLevel = async (req, res) => {
    try {
        const vocabQuestions = await Questions.aggregate([
            {
                $match: {
                    type: "vocab",
                },
            },
            {
                $group: {
                    _id: {
                        type: "$type",
                        level: "$level",
                        set: { $toInt: "$set" }, // Convert "set" to numeric
                    },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        if (vocabQuestions.length < 1)
            return res.status(404).json({ error: "vocab questions not found" });

        const grammarQuestions = await Questions.aggregate([
            {
                $match: {
                    type: "grammar",
                },
            },
            {
                $group: {
                    _id: {
                        type: "$type",
                        level: "$level",
                        set: { $toInt: "$set" }, // Convert "set" to numeric
                    },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        if (grammarQuestions.length < 1)
            return res
                .status(404)
                .json({ error: "grammar questions not found" });

        const kanjiQuestions = await Questions.aggregate([
            {
                $match: {
                    type: "kanji",
                },
            },
            {
                $group: {
                    _id: {
                        type: "$type",
                        level: "$level",
                        set: { $toInt: "$set" }, // Convert "set" to numeric
                    },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        if (kanjiQuestions.length < 1)
            return res.status(404).json({ error: "kanji questions not found" });

        res.status(200).json({
            vocabQuestions,
            grammarQuestions,
            kanjiQuestions,
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// get vocab question by set and level
const getQuestionByLevelTypeSet = async (req, res) => {
    const { level, type, set } = req.params;
    try {
        const questions = await Questions.find({ type, level, set });

        if (questions.length < 1)
            return res.status(404).json({ error: "Question not found!" });

        // randomize the options per questions
        for (let i = 0; i < questions.length; i++) {
            questions[i].options = shuffleArray(questions[i].options);
        }

        // randomize the questions
        const randomizeQuestions = shuffleArray(questions);

        res.status(200).json(randomizeQuestions);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getQuestionsByIds = async (req, res) => {
    try {
        const { idPerQuestion } = req.body;
        if (idPerQuestion.length < 1)
            return res
                .status(400)
                .json({ error: `Missing required fields: ${req.body}` });

        const questions = await Questions.find({ _id: { $in: idPerQuestion } });

        if (questions.length < 1)
            return res.status(404).json({ error: "No questions found" });

        res.status(200).json(questions);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getCountQuestionsByLevelTypeSet = async (req, res) => {
    try {
        const questions = await Questions.aggregate([
            {
                $group: {
                    _id: {
                        type: "$type",
                        level: "$level",
                        set: { $toInt: "$set" }, // Convert "set" to numeric,,
                    },
                    count: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        res.status(200).json(questions);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// create single or many questions
const createQuestions = async (req, res) => {
    const token = req.headers.authorization;
    const { questions } = req.body;

    // decode the token to know who has been logged in
    const userData = decode(token);

    try {
        if (userData.role !== "admin" && userData.role !== "teacher")
            return res
                .status(401)
                .json({ error: "Access Denied! Admin or Teacher users only" });

        if (questions.length < 1) throw Error("No question inputted");

        await Questions.insertMany(questions);

        res.status(200).json({ message: "Questions added successfully!" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteQuestion = async (req, res) => {
    const token = req.headers.authorization;
    const { questionId } = req.body;

    const userData = decode(token);

    try {
        if (userData.role !== "admin" && userData.role !== "teacher")
            return res
                .status(401)
                .json({ error: "Access Denied! Admin or Teacher users only" });

        const questionToBeDeleted = await Questions.findByIdAndDelete(
            questionId
        );

        if (!questionToBeDeleted)
            return res.status(404).json({ error: "Question not found!" });

        res.status(200).json({ message: `Question deleted successfully!` });
    } catch (error) {
        res.status(400).json({ error: error.messages });
    }
};

/** Need to delete the grade if the question has been answered because if the question has been deleted the idPerQuestion in grade is searching to questions and if not found it will return error  */
// Delete Question and Grade
const deleteQuestionAndGrades = async (req, res) => {
    const token = req.headers.authorization;
    const { questionId } = req.body;

    const userData = decode(token);

    try {
        if (userData.role !== "admin" && userData.role !== "teacher") {
            return res
                .status(401)
                .json({ error: "Access Denied! Admin or Teacher users only" });
        }

        // Delete the question
        const questionToBeDeleted = await Questions.findByIdAndDelete(
            questionId
        );

        if (!questionToBeDeleted) {
            return res.status(404).json({ error: "Question not found!" });
        }

        // Check if questionId exists in any document's idPerQuestion array
        const questionExistsInGrades = await Grades.findOne({
            idPerQuestion: { $in: [questionId] },
        });

        // Delete grades associated with the questionSetId if it is exist only!
        if (questionExistsInGrades) {
            await Grades.deleteMany({
                questionSetId: questionExistsInGrades.questionSetId,
            });
        }

        res.status(200).json({
            message: "Question and associated grades deleted successfully",
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const updateQuestionById = async (req, res) => {
    const token = req.headers.authorization;
    const userData = decode(token);

    const {
        questionId,
        question,
        options,
        type,
        level,
        set,
        answer,
        optionsTranslate,
        questionTranslate,
    } = req.body;

    try {
        if (userData.role !== "admin" && userData.role !== "teacher")
            return res.status(401).json({
                error: "Access Denied!, Admin and Teacher users only!",
            });

        const optionsContainsEmptyString = options.includes("");
        if (!question) throw new Error("Question must not be empty field!");

        if (optionsContainsEmptyString)
            throw new Error("Options must not include empty string");

        if (!type) throw new Error("Type must not be empty field!");
        if (!level) throw new Error("Level must not be empty field!");
        if (!set) throw new Error("Set must not be empty fields!");
        if (!answer) throw new Error("Answer must not be empty fields!");

        const updatedQuestion = await Questions.findByIdAndUpdate(questionId, {
            question,
            options,
            type,
            level,
            set,
            answer,
            optionsTranslate,
            questionTranslate,
        });

        if (!updatedQuestion)
            return res.status(404).json({ error: "No such questions exist!" });

        res.status(200).json({ message: "Question updated successfully!" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Helper function
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

module.exports = {
    getQuestionsByTypeLevel,
    getAllQuestions,
    getQuestionByType,
    getCountQuestionsByLevelTypeSet,
    getQuestionCountByTypeLevel,
    getQuestionByLevelTypeSet,
    getQuestionsByIds,
    deleteQuestion,
    deleteQuestionAndGrades,
    createQuestions,
    updateQuestionById,
};
