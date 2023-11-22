const express = require("express");
const {
    insertAlphabet,
    getAllHiragana,
    getAllKatakana,
    getMainHiragana,
    getMainkatakana,
    getDakutenHiragana,
    getDakutenKatakana,
    getCombinationHiragana,
    getCombinationKatakana,
    getSpecificKana,
} = require("../controllers/alphabetController");

const router = express.Router();

// get all hiragana alphabet
router.get("/hiragana", getAllHiragana);

// get all katakana alphabet
router.get("/katakana", getAllKatakana);

// get all main hiragana
router.get("/hiragana-main", getMainHiragana);

// get all main katakana
router.get("/katakana-main", getMainkatakana);

// get all dakuten hiragana
router.get("/hiragana-dakuten", getDakutenHiragana);

// get all dakuten katakana
router.get("/katakana-dakuten", getDakutenKatakana);

// get all combination hiragana
router.get("/hiragana-combination", getCombinationHiragana);

// get all combination katakana
router.get("/katakana-combination", getCombinationKatakana);

// get hiragana / katakana custom choice of user
router.post("/kana-custom", getSpecificKana);

// Insert alphabet
router.post("/create", insertAlphabet);

module.exports = router;
