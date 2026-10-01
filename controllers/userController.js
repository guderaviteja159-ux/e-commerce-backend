const User = require("../models/user");

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name) {
            return res.status(400).json({
                status: false,
                message: "Name is mandatory"
            });
        }

        if (!email) {
            return res.status(400).json({
                status: false,
                message: "Email is mandatory"
            });
        }

        if (!password) {
            return res.status(400).json({
                status: false,
                message: "Password is mandatory"
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({
                status: false,
                message: "Invalid email format"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                status: false,
                message: "Password should contain at least 6 characters"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                status: false,
                message: "Email already registered"
            });
        }

        const user = new User({
            name,
            email,
            password
        });

        await user.save();

        return res.status(201).json({
            status: true,
            message: "Registration Successful"
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            status: false,
            message: "Server Error"
        });
    }
};


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User does not exist"
            });
        }

        if (user.password !== password) {
            return res.status(401).json({
                status: false,
                message: "Invalid password"
            });
        }

        return res.status(200).json({
            status: true,
            message: "Login Successful"
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            status: false,
            message: "Server Error"
        });
    }
};


module.exports = {
    registerUser,
    loginUser
};