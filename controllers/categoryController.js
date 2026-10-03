const Category = require("../models/category");
const Product = require("../models/product");

// CREATE CATEGORY
const createCategory = async (req, res) => {
    try {
        const { name, description, status } = req.body;

        if (!name || !status) {
            return res.status(400).json({
                message: "Name and status are required"
            });
        }

        if (status !== "active" && status !== "inactive") {
            return res.status(400).json({
                message: "Status must be active or inactive"
            });
        }

        const existingCategory = await Category.findOne({ name });

        if (existingCategory) {
            return res.status(400).json({
                message: "Category already exists"
            });
        }

        const category = new Category({
            name,
            description,
            status
        });

        await category.save();

        res.status(201).json({
            message: "Category created successfully",
            category
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// GET ALL CATEGORIES
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();

        res.status(200).json(categories);

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// GET CATEGORY BY ID
const getCategoryById = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        res.status(200).json(category);

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// UPDATE CATEGORY
const updateCategory = async (req, res) => {
    try {
        const { name, description, status } = req.body;

        if (!name || !status) {
            return res.status(400).json({
                message: "Name and status are required"
            });
        }

        if (status !== "active" && status !== "inactive") {
            return res.status(400).json({
                message: "Status must be active or inactive"
            });
        }

        const category = await Category.findByIdAndUpdate(
            req.params.id,
            {
                name,
                description,
                status,
                updatedAt: new Date()
            },
            { new: true }
        );

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        res.status(200).json({
            message: "Category updated successfully",
            category
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// DELETE CATEGORY
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            });
        }

        res.status(200).json({
            message: "Category deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


// GET PRODUCTS BY CATEGORY
const getProductsByCategory = async (req, res) => {
    try {
        const products = await Product.find({
            categoryId: req.params.id
        });

        res.status(200).json(products);

    } catch (error) {
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
};


module.exports = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    getProductsByCategory
};