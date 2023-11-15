const jwt = require("jsonwebtoken");

// used in algorithm for encrypting our data which makes it difficult to decode the information without define secret key.
const secret = process.env.SECRET;

const createToken = (user) => {
    // Payload of JWT
    const data = {
        id: user._id,
        email: user.email,
        role: user.role,
        // isAdmin: user.isAdmin,
    };
    // Generate a JSON web token using the jwt's sign method
    return jwt.sign(data, secret, { expiresIn: "1d" });
};

const verify = (req, res, next) => {
    let token = req.headers.authorization;
    try {
        // Validate the "token" using verify method, to decrypt the token using the secret code.

        if (!token) {
            return res.json("Authentication failed! Please login first!");
        }

        token = token.slice(7, token.length);
        return jwt.verify(token, secret, (error) => {
            if (error) {
                return res.json("Invalid Token");
            } else {
                next();
            }
        });
    } catch (error) {
        console.log(`Im in verify \n${error.message}`);
        res.json(error.message);
    }
};

const decode = (token) => {
    if (!token) {
        return null;
    } else {
        token = token.slice(7, token.length);

        return jwt.verify(token, secret, (error, data) => {
            if (error) {
                return null;
            } else {
                return jwt.decode(token, { complete: true }).payload;
            }
        });
    }
};

module.exports = { createToken, verify, decode };
