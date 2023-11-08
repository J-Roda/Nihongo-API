const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const Schema = mongoose.Schema;

const userSchema = Schema({
    // firstName: {
    //     type: String,
    //     // required: true,
    // },
    // lastName: {
    //     type: String,
    //     // required: true,
    // },
    // cellNumber: {
    //     type: String,
    //     // required: true,
    // },
    // gender: {
    //     type: String,
    //     // required: true,
    // },
    // address: [
    //     {
    //         street: {
    //             type: String,
    //             // required: true,
    //         },
    //         barangay: {
    //             type: String,
    //             // required: true,
    //         },
    //         municipality: {
    //             type: String,
    //             // required: true,
    //         },
    //         province: {
    //             type: String,
    //             // required: true,
    //         },
    //         region: {
    //             type: String,
    //             // required: true,
    //         },
    //     },
    // ],
    username: {
        type: String,
        required: true,
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
    const [
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
    ] = data;

    if (
        // !firstName ||
        //  !lastName ||
        //  !cellNumber ||
        //  !gender ||
        //  !street ||
        //  !barangay ||
        //  !municipality ||
        //  !province ||
        //  !region ||
        !username ||
        !email ||
        !password ||
        !confirmPassword
    ) {
        throw Error("All fields must be filled");
    }

    if (!validator.isEmail(email) || !email.includes("@awsys-i.com")) {
        throw Error("Email Invalid");
    }

    if (!validator.isStrongPassword(password)) {
        throw Error("Password not strong enough");
    }

    if (password !== confirmPassword) {
        throw Error("Password does not match");
    }

    const usernameExist = await this.findOne({ username });

    if (usernameExist) {
        throw Error("Sorry!, Username already in use");
    }

    const emailExist = await this.findOne({ email });
    if (emailExist) {
        throw Error("Sorry!, Email already in use");
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await this.create({
        // firstName,
        // lastName,
        // cellNumber,
        // gender,
        // address: [
        //     {
        //         street,
        //         barangay,
        //         municipality,
        //         province,
        //         region,
        //     },
        // ],
        username,
        email,
        password: hash,
    });

    return user;
};

userSchema.statics.login = async function (email, password) {
    if (!email || !password) {
        throw Error("All fields must be filled");
    }

    const user = await this.findOne({ email });

    if (!user) {
        throw Error("Incorrect email!");
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        throw Error("Incorrect password!");
    }

    return user;
};

module.exports = mongoose.model("User", userSchema);
