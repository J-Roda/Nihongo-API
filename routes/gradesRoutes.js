const express = require("express");

const {
    addGrades,
    getAllGrades,
    getGrades,
    getSpicificGrades,
    getTotalScoresAndItems,
    deleteGradesByQuestionSetId,
} = require("../controllers/gradesController");

const router = express.Router();

// Get all grades
router.get("/all", getAllGrades);

router.post("/scores-total", getTotalScoresAndItems);

// Get all grades of specific user
router.post("/user-grades", getGrades);

// Get grade of specific set by userId and questionId
router.post("/grade-by-set", getSpicificGrades);

router.post("/add-grades", addGrades);

router.delete("/delete-grades", deleteGradesByQuestionSetId);

module.exports = router;
