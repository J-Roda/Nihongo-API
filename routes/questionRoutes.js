const express = require("express");

const router = express.Router();

const {
    createManyQuestions,
    getQuestions,
    getAllQuestions,
} = require("../controllers/questionsController");

// get all questions
router.get("/all", getAllQuestions);

// get questions depending on type and level
router.get("/type=:type&level=:level", getQuestions);

// create single or many questions
router.post("/create", createManyQuestions);

module.exports = router;
