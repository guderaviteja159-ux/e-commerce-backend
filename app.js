const express = require("express");
const connectDB = require("./config/db");

require("dotenv").config();

const userRouter = require("./routes/userRouter");
const productRouter = require("./routes/productRouter");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

connectDB();

app.use("/user", userRouter);

app.post("/test", (req, res) => {
    res.json({
        message: "POST route is working"
    });
});

app.use("/product", productRouter);

console.log("PRODUCT ROUTER LOADED");

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});