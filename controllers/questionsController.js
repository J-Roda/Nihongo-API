const Questions = require("../models/Questions");

// get all questions
const getAllQuestions = async (req, res) => {
    try {
        const question = await Questions.find();

        if (question.length < 1)
            return res.status(404).json({ error: "No such question exist!" });

        res.status(200).json(question);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
// get questions depending on type and level
const getQuestions = async (req, res) => {
    const { type, level } = req.params;

    try {
        const question = await Questions.find({ type: type, level: level });

        if (question.length < 1)
            return res.status(404).json({ error: "No such question exist!" });

        res.status(200).json(question);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// get questions by set and type
const getQuestionBySetType = async (req, res) => {
    try {
        const questions = await Questions.aggregate([
            {
                $group: { typeSet: { type: "$type", set: "$set" } },
            },
            { $sort: { set: -1 } },
        ]);
        if (questions.length < 1)
            return res.status(404).json({ error: "question not found" });

        res.status(200).json(questions);
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

        res.status(200).json(questions);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// create single or many questions
const createManyQuestions = async (req, res) => {
    const questions = req.body;
    try {
        if (questions.length < 1) throw Error("No question inputted");

        const insertedQuestions = await Questions.insertMany(questions);
        res.status(200).json(insertedQuestions);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getQuestions,
    getAllQuestions,
    getQuestionBySetType,
    getQuestionByLevelTypeSet,
    createManyQuestions,
};
