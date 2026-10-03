const dns = require("dns");

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
require("dotenv").config();

const connectDB = require("./config/db");

const userRouter = require("./routes/userRouter");
const productRouter = require("./routes/productRouter");
const categoryRouter = require("./routes/categoryRouter");

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

app.get("/hello", (req, res) => {
    res.send("Hello from this server");
});

app.use("/product", productRouter);
app.use("/category", categoryRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});