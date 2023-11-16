const express = require("express");

const router = express.Router();

const {
    createManyQuestions,
    getQuestions,
    getAllQuestions,
    getQuestionBySetType,
    getQuestionByLevelTypeSet,
} = require("../controllers/questionsController");

// get all questions
router.get("/all", getAllQuestions);

router.get("/type-set", getQuestionBySetType);

// create single or many questions
router.post("/create", createManyQuestions);

// get questions depending on type and level
router.get("/type=:type&level=:level", getQuestions);

// get questions by level, type, and set
router.get("/n:level-:type-exercise-:set", getQuestionByLevelTypeSet);

module.exports = router;
