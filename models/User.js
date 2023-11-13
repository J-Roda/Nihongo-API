const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const userSchema = Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "Student",
    },
});

userSchema.statics.signup = async function (...data) {
    const [username, email, password, confirmPassword] = data;

    // Check if all fields has been filled
    if (!username || !email || !password || !confirmPassword) {
        throw Error("All fields must be filled");
    }

    // Check if email is in right format or from @awsys-i
    if (!validator.isEmail(email) || !email.includes("@awsys-i.com")) {
        throw Error("Email Invalid");
    }

    // Check is passwod contains 1 upper, lower case, number, special character and 8 length
    if (!validator.isStrongPassword(password)) {
        throw Error("Password not strong enough");
    }

    // Check if password is match
    if (password !== confirmPassword) {
        throw Error("Password does not match");
    }

    // Check if usernameExist already
    const usernameExist = await this.findOne({ username });

    if (usernameExist) {
        throw Error("Sorry!, Username already in use");
    }

    // Check if emailExist already
    const emailExist = await this.findOne({ email });

    if (emailExist) {
        throw Error("Sorry!, Email already in use");
    }

    // Hash the password so that even database has been breached password is safe.
    const hash = await bcrypt.hash(password, 10);

    // If no error has been thrown create the user
    const user = await this.create({
        username,
        email,
        password: hash,
    });

    return user;
};

userSchema.statics.login = async function (email, password) {
    // Check if email and password is entered
    if (!email || !password) {
        throw Error("All fields must be filled");
    }

    // Check if email already registered
    const user = await this.findOne({ email });

    // If no user throw error
    if (!user) {
        throw Error("Incorrect email or password!");
    }

    // Check if password match
    const match = await bcrypt.compare(password, user.password);

    // If password not match throw error
    if (!match) {
        throw Error("Incorrect email or password!");
    }

    return user;
};

module.exports = mongoose.model("User", userSchema);
