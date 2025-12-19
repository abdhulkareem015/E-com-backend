const express = require("express");
const Product = require("../models/Product");
const router = express.Router();

// Get all products
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get product by ID
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new product
router.post("/", async (req, res) => {
    try {
        const { name, price, image, description, quantity } = req.body;
        const newProduct = new Product({
            name,
            price,
            image,
            description,
            quantity
        });
        
        const savedProduct = await newProduct.save();
        res.status(201).json({ message: "Product created successfully", product: savedProduct });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete product
router.delete("/:id", async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;