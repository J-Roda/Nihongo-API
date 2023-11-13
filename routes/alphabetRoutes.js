const express = require("express");
const {
    insertAlphabet,
    getAllHiragana,
    getAllKatakana,
    getBasicHiragana,
    getBasicKatakana,
} = require("../controllers/alphabetController");

const router = express.Router();

// get all the hiragana / katana alphabet depends on request
router.get("/hiragana", getAllHiragana);

// get all the katakana alphabet
router.get("/katakana", getAllKatakana);

// get the basic hiragana
router.get("/hiragana-basic", getBasicHiragana);

// get the modified hiragana / katakana
router.get("/katakana-basic", getBasicKatakana);

// get the advance hiragana / katakana
router.get("/hiragana");

// Insert alphabet
router.post("/create", insertAlphabet);

module.exports = router;
