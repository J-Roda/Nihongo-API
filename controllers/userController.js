const User = require("../models/User");

const { createToken, decode } = require("../auth");
const { default: mongoose } = require("mongoose");

// User register
const signupUser = async (req, res) => {
    try {
        const user = await User.signup(req.body);

        // create token
        const token = createToken(user);

        res.status(200).json(token);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// User login
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);

        // create token
        const token = createToken(user);
        res.status(200).json(token);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// get user profile
const getUserProfile = async (req, res) => {
    // get the token
    const token = req.headers.authorization;

    // decode the token to know who has been logged in
    const userData = decode(token);

    try {
        const user = await User.findById(userData.id, { password: false });

        if (!user)
            return res.status(404).json({ error: "No such user exist!" });

        res.status(200).json(user);
    } catch (error) {
        res.status(400).json(error);
    }
};

const removeUser = async (req, res) => {
    const token = req.headers.authorization;
    const userData = decode(token);

    const { userId } = req.body;

    // Validate if user ID inputted is same as mongoDB format
    if (!mongoose.Types.ObjectId.isValid(userId))
        return res.status(400).json({ error: "user id invalid" });

    console.log(userData);
    try {
        if (userData.role !== "admin")
            return res
                .status(401)
                .json({ error: "Access Denied!, Admin users only!" });

        const user = await User.findById(userId);

        if (!user)
            return res.status(404).json({ error: "User does not exist" });

        const deletedUser = await User.findByIdAndDelete(userId);

        res.status(200).json(deletedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = {
    signupUser,
    login,
    getUserProfile,
    removeUser,
};
