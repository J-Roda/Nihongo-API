const express = require("express");

const router = express.Router();

const {
    createManyQuestions,
    getQuestions,
    getAllQuestions,
    getQuestionBySetType,
} = require("../controllers/questionsController");

// get all questions
router.get("/all", getAllQuestions);

router.get("/type-set", getQuestionBySetType);

// create single or many questions
router.post("/create", createManyQuestions);

// get questions depending on type and level
router.get("/type=:type&level=:level", getQuestions);

module.exports = router;
