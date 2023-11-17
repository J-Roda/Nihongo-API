const express = require("express");

const router = express.Router();

const {
    createQuestions,
    getQuestions,
    getAllQuestions,
    getQuestionCountByTypeLevel,
    getQuestionByLevelTypeSet,
} = require("../controllers/questionsController");

// get all questions
router.get("/all", getAllQuestions);

router.get("/count-type-level", getQuestionCountByTypeLevel);

// create single or many questions
router.post("/create", createQuestions);

// get questions depending on type and level
router.get("/type=:type&level=:level", getQuestions);

// get questions by level, type, and set
router.get("/n:level-:type-exercise-:set", getQuestionByLevelTypeSet);

module.exports = router;
