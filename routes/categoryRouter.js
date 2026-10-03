const express = require("express");

const router = express.Router();

const {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
    getProductsByCategory
} = require("../controllers/categoryController");

// TEST CATEGORY ROUTER
router.get("/test", (req, res) => {
    res.json({
        message: "Category router is working"
    });
});

// CREATE CATEGORY
router.post("/create", createCategory);

// GET ALL CATEGORIES
router.get("/list", getCategories);

// GET PRODUCTS BY CATEGORY
router.get("/:id/products", getProductsByCategory);

// GET CATEGORY BY ID
router.get("/:id", getCategoryById);

// UPDATE CATEGORY
router.put("/:id", updateCategory);

// DELETE CATEGORY
router.delete("/:id", deleteCategory);

module.exports = router;