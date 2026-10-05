const Cart = require("../models/cart");
const User = require("../models/user");
const Product = require("../models/product");

const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        // Check user
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Check product
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // Check product status
        if (product.status !== "active") {
            return res.status(400).json({
                message: "Product is not active"
            });
        }

        // Check quantity
        if (quantity <= 0) {
            return res.status(400).json({
                message: "Quantity must be greater than 0"
            });
        }

        // Check stock
        if (quantity > product.stock) {
            return res.status(400).json({
                message: "Insufficient stock"
            });
        }

        // Check if product already exists in user's cart
        const existingCart = await Cart.findOne({
            userId: userId,
            productId: productId
        });

        if (existingCart) {
            existingCart.quantity += quantity;
            existingCart.price = product.price;

            await existingCart.save();

            return res.status(200).json({
                message: "Cart updated successfully",
                cart: existingCart
            });
        }

        // Create new cart item
        const cart = new Cart({
            userId: userId,
            productId: productId,
            quantity: quantity,
            price: product.price
        });

        await cart.save();

        res.status(201).json({
            message: "Product added to cart",
            cart: cart
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    addToCart
};