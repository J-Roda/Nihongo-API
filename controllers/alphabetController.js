const Alphabet = require("../models/Alphabet");

const getAllHiragana = async (req, res) => {
    try {
        const allHiragana = await Alphabet.find().select("hiragana romaji");

        if (allHiragana.length < 1)
            return res
                .status(404)
                .json({ error: "No such type of alphabet exist!" });

        res.status(200).json(allHiragana);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAllKatakana = async (req, res) => {
    try {
        const allKatakana = await Alphabet.find().select("katakana romaji");

        if (allKatakana.length < 1)
            return res
                .status(404)
                .json({ error: "No such type of alphabet exist!" });

        res.status(200).json(allKatakana);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getMainHiragana = async (req, res) => {
    try {
        const mainHiragana = await Alphabet.find({ mode: "main" }).select(
            "hiragana romaji"
        );

        if (mainHiragana.length < 1)
            return res
                .status(404)
                .json({ error: "No such type of alphabet exist!" });

        res.status(200).json(mainHiragana);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getMainkatakana = async (req, res) => {
    try {
        const mainKatakana = await Alphabet.find({ mode: "main" }).select(
            "katakana romaji"
        );

        if (mainKatakana.length < 1)
            return res
                .status(404)
                .json({ error: "No such type of alphabet exist!" });

        res.status(200).json(mainKatakana);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getDakutenHiragana = async (req, res) => {
    try {
        const dakutenHiragana = await Alphabet.find({ mode: "dakuten" }).select(
            "hiragana romaji"
        );

        if (dakutenHiragana.length < 1)
            return res
                .status(404)
                .json({ error: "No such type of alphabet exist!" });

        return res.status(200).json(dakutenHiragana);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getDakutenKatakana = async (req, res) => {
    try {
        const dakutenKatakana = await Alphabet.find({ mode: "dakuten" }).select(
            "katakana romaji"
        );

        if (dakutenKatakana.length < 1)
            return res
                .status(404)
                .json({ error: "No such type of alphabet exist!" });

        return res.status(200).json(dakutenKatakana);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getCombinationHiragana = async (req, res) => {
    try {
        const combinationHiragana = await Alphabet.find({
            mode: "combination",
        }).select("hiragana romaji");

        if (combinationHiragana.length < 1)
            return res
                .status(404)
                .json({ error: "No such type of alphabet exist!" });

        return res.status(200).json(combinationHiragana);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getCombinationKatakana = async (req, res) => {
    try {
        const combinationKatakana = await Alphabet.find({
            mode: "combination",
        }).select("katakana romaji");

        if (combinationKatakana.length < 1)
            return res
                .status(404)
                .json({ error: "No such type of alphabet exist!" });

        return res.status(200).json(combinationKatakana);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getSpecificKana = async (req, res) => {
    try {
        const selectedKana = await Alphabet.selectKana(req.body);

        return res.status(200).json(selectedKana);
    } catch (error) {
        if (error.status)
            return res.status(error.status).json({ error: error.message });

        res.status(400).json({ error: error.message });
    }
};

const insertAlphabet = async (req, res) => {
    const alphabet = req.body;

    try {
        const insertedAlphabet = await Alphabet.insertMany(alphabet);

        res.status(200).json(insertedAlphabet);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    getAllHiragana,
    getAllKatakana,
    getMainHiragana,
    getMainkatakana,
    getDakutenHiragana,
    getDakutenKatakana,
    getCombinationHiragana,
    getCombinationKatakana,
    getSpecificKana,
    insertAlphabet,
};
