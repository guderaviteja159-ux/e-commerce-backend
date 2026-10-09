const User = require("../models/user");

const registerUser = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        // Only phone number validation
        if (!/^[0-9]{10}$/.test(phone || "")) {
            return res.status(400).json({
                status: false,
                message: "Phone number must contain exactly 10 digits"
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
            phone,
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
            message: "Server errorr"
        });
    }
};


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user || user.password !== password) {
            return res.status(401).json({
                status: false,
                message: "Invalid email or password"
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