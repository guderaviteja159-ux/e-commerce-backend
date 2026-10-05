const express = require("express");
require("dotenv").config();

const connectDB = require("./config/db");

const userRouter = require("./routes/userRouter");
const productRouter = require("./routes/productRouter");
const categoryRouter = require("./routes/categoryRouter");
const cartRouter = require("./routes/cartRouter");
const orderRouter = require("./routes/orderRouter");
const mutualFundRouter = require("./routes/mutualFundRouter");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

connectDB();

app.use("/user", userRouter);
app.use("/product", productRouter);
app.use("/category", categoryRouter);
app.use("/cart", cartRouter);
app.use("/order", orderRouter);
app.use("/api/mutual-funds", mutualFundRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});