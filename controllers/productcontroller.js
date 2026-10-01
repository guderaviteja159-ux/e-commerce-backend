const Product = require("../models/product");

const createProduct = async (req, res) => {
    try {
        const { name, description, price, stock, status } = req.body;

        if (!name || !description || price === undefined || stock === undefined || !status) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (price <= 0) {
            return res.status(400).json({
                message: "Price must be greater than 0"
            });
        }

        if (stock < 0) {
            return res.status(400).json({
                message: "Stock cannot be negative"
            });
        }

        if (status !== "active" && status !== "inactive") {
            return res.status(400).json({
                message: "Status must be active or inactive"
            });
        }

        const product = new Product({
            name,
            description,
            price,
            stock,
            status
        });

        await product.save();

        res.status(201).json({
            message: "Product created successfully",
            product
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const getProducts = async (req, res) => {
    try {
        const products = await Product.find();

        res.status(200).json(products);

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json(product);

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { name, description, price, stock, status } = req.body;

        if (!name || !description || price === undefined || stock === undefined || !status) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        if (price <= 0) {
            return res.status(400).json({
                message: "Price must be greater than 0"
            });
        }

        if (stock < 0) {
            return res.status(400).json({
                message: "Stock cannot be negative"
            });
        }

        if (status !== "active" && status !== "inactive") {
            return res.status(400).json({
                message: "Status must be active or inactive"
            });
        }

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name,
                description,
                price,
                stock,
                status,
                updatedAt: new Date()
            },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product updated successfully",
            product
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.status(200).json({
            message: "Product deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
};