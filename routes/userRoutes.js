const express = require("express");

const router = express.Router();

const {
    login,
    signupUser,
    getUserProfile,
} = require("../controllers/userController");

const { verify } = require("../auth");

// User login
router.post("/login", login);

// User register
router.post("/signup", signupUser);

// Show User Profile
router.get("/profile", verify, getUserProfile);

module.exports = router;
