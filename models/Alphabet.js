const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const alphabetSchema = new Schema({
    hiragana: {
        type: String,
    },
    katakana: {
        type: String,
    },
    romaji: {
        type: String,
    },
    mode: {
        type: String,
    },
    row: {
        type: String,
    },
    col: {
        type: String,
    },
});

module.exports = mongoose.model("Alphabet", alphabetSchema);
