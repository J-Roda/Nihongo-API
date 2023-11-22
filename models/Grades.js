const mongoose = require("mongoose");

const { Schema } = mongoose;

const gradesSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    questionId: {
        type: Schema.Types.ObjectId,
        ref: "Question",
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
});

module.exporsts = mongoose.model("Grades", gradesSchema);
