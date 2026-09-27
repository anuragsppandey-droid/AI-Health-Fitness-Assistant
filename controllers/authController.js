
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register User
const registerUser = async (req, res) => {

    try {

        // Clean and normalize input
        const nameValue = req.body.name;
        const emailValue = req.body.email;
        const password = req.body.password;

        const name = nameValue ? nameValue.trim() : "";
        const email = emailValue
            ? emailValue.trim().toLowerCase()
            : "";

        // Validate name
        if (!name || name.length < 2) {
            return res.status(400).json({
                message: "Name must be at least 2 characters"
            });
        }

        // Validate email
        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        // Validate password
        if (!password || password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({
            message: "Registration Successful"
        });

    } catch (error) {

        console.log(error);

        res.status(400).json({
            message: error.message
        });

    }

};


// Login User
const loginUser = async (req, res) => {

    try {

        // Clean and normalize input
        const emailValue = req.body.email;
        const password = req.body.password;

        const email = emailValue
            ? emailValue.trim().toLowerCase()
            : "";

        // Validate email
        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        // Validate password
        if (!password) {
            return res.status(400).json({
                message: "Password is required"
            });
        }

        // Check if user exists
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        // Create JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            {
                expiresIn:
                    process.env.JWT_EXPIRES_IN || "7d"
            }
        );

        // Send token and user information
        res.status(200).json({

            message: "Login Successful",

            token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Server Error"
        });

    }

};


module.exports = {
    registerUser,
    loginUser
};
