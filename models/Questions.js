const mongoose = require("mongoose");

const { Schema } = mongoose;

const questionsSchema = new Schema({
    question: {
        type: String,
        required: true,
    },
    options: {
        type: Array,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    level: {
        type: String,
        required: true,
    },
    set: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    },
    optionsTranslate: {
        type: Array,
    },
    questionTranslate: {
        type: String,
        required: true,
    },
});
module.exports = mongoose.model("Questions", questionsSchema);
