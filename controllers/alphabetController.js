const Alphabet = require("../models/Alphabet");

const getAllHiragana = async (req, res) => {
    try {
        const alphabet = await Alphabet.find({}).select("hiragana romaji");

        if (!alphabet)
            return res
                .status(404)
                .json({ error: "No such type of alphabet exist!" });

        res.status(200).json(alphabet);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getAllKatakana = async (req, res) => {
    try {
        const alphabet = await Alphabet.find({}).select("katakana romaji");

        if (!alphabet)
            return res
                .status(404)
                .json({ error: "No such type of alphabet exist!" });

        res.status(200).json(alphabet);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getBasicHiragana = async (req, res) => {
    try {
        const alphabet = await Alphabet.find({ mode: "basic" }).select(
            "hiragana romaji"
        );

        if (!alphabet)
            return res
                .status(404)
                .json({ error: "No such type of alphabet exist!" });

        res.status(200).json(alphabet);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getBasicKatakana = async (req, res) => {
    try {
        const alphabet = await Alphabet.find({ mode: "basic" }).select(
            "katakana romaji"
        );

        if (!alphabet)
            return res
                .status(404)
                .json({ error: "No such type of alphabet exist!" });

        res.status(200).json(alphabet);
    } catch (error) {
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
    getBasicHiragana,
    getBasicKatakana,
    insertAlphabet,
};
