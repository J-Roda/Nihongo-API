const Questions = require("../models/Questions");

// get all questions
const getAllQuestions = async (req, res) => {
    try {
        const question = await Questions.find();

        if (!question)
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

        if (!question)
            return res.status(404).json({ error: "No such question exist!" });

        res.status(200).json(question);
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
    createManyQuestions,
};
