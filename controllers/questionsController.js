const Questions = require("../models/Questions");

// get all questions
const getAllQuestions = async (req, res) => {
    try {
        const vocabQuestions = await Questions.find({ type: "vocab" });
        const grammarQuestions = await Questions.find({ type: "grammar" });
        const kanjiQuestions = await Questions.find({ type: "kanji" });

        if (vocabQuestions.length < 1)
            return res
                .status(404)
                .json({ error: "No such vocab question exist!" });

        if (grammarQuestions.length < 1)
            return res
                .status(404)
                .json({ error: "No such vocab question exist!" });
        if (kanjiQuestions.length < 1)
            return res
                .status(404)
                .json({ error: "No such vocab question exist!" });

        res.status(200).json({
            vocabQuestions,
            grammarQuestions,
            kanjiQuestions,
        });
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
                        set: "$set",
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
                        set: "$set",
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
                        set: "$set",
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

        // randomize the questions
        for (let i = questions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [questions[i], questions[j]] = [questions[j], questions[i]];
        }
        res.status(200).json(questions);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// create single or many questions
const createQuestions = async (req, res) => {
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
    getQuestionCountByTypeLevel,
    getQuestionByLevelTypeSet,
    createQuestions,
};
