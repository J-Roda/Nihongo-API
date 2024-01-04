const express = require("express");

const router = express.Router();

const {
    createQuestions,
    getQuestionsByTypeLevel,
    getAllQuestions,
    getQuestionCountByTypeLevel,
    getQuestionByLevelTypeSet,
    getQuestionsByIds,
    getCountQuestionsByLevelTypeSet,
    deleteQuestion,
    deleteQuestionAndGrades,
    getQuestionByType,
    updateQuestionById,
} = require("../controllers/questionsController");
const { verify } = require("../auth");

// get all questions
router.get("/all", getAllQuestions);

router.get("/count-type-level", getQuestionCountByTypeLevel);

router.get("/count-by-sets", getCountQuestionsByLevelTypeSet);

router.post("/find-qn-by-ids", getQuestionsByIds);

// Delete single question with id
router.delete("/delete", verify, deleteQuestion);

// Delete the question with id and grades that has this question Id
router.delete("/delete-question-grades", verify, deleteQuestionAndGrades);

// create single or many questions
router.post("/create", verify, createQuestions);

router.post("/get-by-type", getQuestionByType);

router.post("/update", verify, updateQuestionById);

// get questions depending on type and level
router.get("/type=:type&level=:level", getQuestionsByTypeLevel);

// get questions by level, type, and set
router.get("/n:level-:type-exercise-:set", getQuestionByLevelTypeSet);

module.exports = router;
