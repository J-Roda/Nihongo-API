const express = require("express");
const {
    addGrades,
    getAllGrades,
    getGrades,
    getSpicificGrades,
} = require("../controllers/gradesController");

const router = express.Router();

// Get all grades
router.get("/all", getAllGrades);

// Get all grades of specific user
router.post("/grades", getGrades);

// Get grade of specific set by userId and questionId
router.post("/grade", getSpicificGrades);

router.post("/add-grades", addGrades);

module.exports = router;
