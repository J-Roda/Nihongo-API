const express = require("express");

const router = express.Router();

const {
    login,
    signupUser,
    getUserProfile,
    deleteUser,
    getAllUsers,
    getUserByEmail,
} = require("../controllers/userController");

const { verify } = require("../auth");

// User login
router.post("/login", login);

// User register
router.post("/signup", signupUser);

// Get all users
router.get("/all", verify, getAllUsers);

// Show User Profile
router.get("/profile", verify, getUserProfile);

// Get user by email
router.post("/get-by-email", verify, getUserByEmail);

// delete user
router.delete("/delete", verify, deleteUser);

module.exports = router;
