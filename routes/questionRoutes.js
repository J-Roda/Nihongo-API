const express = require("express");

const router = express.Router();

const {
    createManyQuestions,
    getQuestions,
    getAllQuestions,
} = require("../controllers/questionsController");

router.get("/all", getAllQuestions);

router.get("/type=:type&level=:level", getQuestions);

router.post("/create", createManyQuestions);

module.exports = router;
