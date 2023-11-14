const express = require("express");

const router = express.Router();

const {
    login,
    signupUser,
    getUserProfile,
    removeUser,
} = require("../controllers/userController");

const { verify } = require("../auth");

// User login
router.post("/login", login);

// User register
router.post("/signup", signupUser);

// Show User Profile
router.get("/profile", verify, getUserProfile);

router.delete("/delete", verify, removeUser);

module.exports = router;
