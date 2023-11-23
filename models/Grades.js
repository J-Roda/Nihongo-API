const mongoose = require("mongoose");

const { Schema } = mongoose;

const gradesSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    questionSetId: {
        type: String,
        required: true,
    },
    idPerQuestion: {
        type: Array,
        required: true,
    },
    userAnswers: {
        type: Array,
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model("Grades", gradesSchema);
