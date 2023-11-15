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
                $group: { _id: { type: "$type", set: "$set" } },
            },
            { $sort: { set: -1 } },
        ]);
        if (questions.length < 1)
            return res.status(404).json({ error: "question no found" });

        res.status(200).json(questions);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// create single or many questions
const createManyQuestions = async (req, res) => {
    const questions = req.body;
    try {
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
    createManyQuestions,
};
