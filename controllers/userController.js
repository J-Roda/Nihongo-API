const User = require("../models/User");

const { createToken, decode } = require("../auth");

// User register
const signupUser = async (req, res) => {
    const {
        // firstName,
        // lastName,
        // cellNumber,
        // gender,
        // street,
        // barangay,
        // municipality,
        // province,
        // region,
        username,
        email,
        password,
        confirmPassword,
    } = req.body;

    try {
        const user = await User.signup(
            //   firstName,
            //   lastName,
            //   cellNumber,
            //   gender,
            //   street,
            //   barangay,
            //   municipality,
            //   province,
            //   region,
            username,
            email,
            password,
            confirmPassword
        );

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
        if (error.message === "")
            res.status(400).json({ error: error.message });
    }
};

const getUserProfile = async (req, res) => {
    const token = req.headers.authorization;
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

module.exports = {
    signupUser,
    login,
    getUserProfile,
};
