const express = require("express");

const router = express.Router();

const {
    createQuestions,
    getQuestions,
    getAllQuestions,
    getQuestionCountByTypeLevel,
    getQuestionByLevelTypeSet,
    getQuestionsByIds,
    getCountQuestionsByLevelTypeSet,
    deleteQuestion,
} = require("../controllers/questionsController");
const { verify } = require("../auth");

// get all questions
router.get("/all", getAllQuestions);

router.get("/count-type-level", getQuestionCountByTypeLevel);

router.get("/count-by-sets", getCountQuestionsByLevelTypeSet);

router.post("/find-qn-by-ids", getQuestionsByIds);

router.delete("/delete", verify, deleteQuestion);

// create single or many questions
router.post("/create", verify, createQuestions);

// get questions depending on type and level
router.get("/type=:type&level=:level", getQuestions);

// get questions by level, type, and set
router.get("/n:level-:type-exercise-:set", getQuestionByLevelTypeSet);

module.exports = router;
