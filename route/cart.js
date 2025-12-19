const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const router = express.Router();

// Get cart (simplified - without user authentication)
router.get("/", async (req, res) => {
    try {
        // For demo purposes, using a default user ID
        const defaultUserId = "676b8f9e123456789abcdef0"; // Replace with actual user ID from auth
        
        const cart = await Cart.findOne({ user: defaultUserId }).populate('items.product');
        if (!cart) {
            return res.json([]);
        }
        
        // Transform to match frontend format
        const cartItems = cart.items.map(item => ({
            id: item.product._id,
            name: item.product.name,
            price: item.price,
            image: item.product.image,
            qty: item.quantity
        }));
        
        res.json(cartItems);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add item to cart
router.post("/", async (req, res) => {
    try {
        const { id, name, price, image, qty = 1 } = req.body;
        
        // Verify product exists
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }
        
        const defaultUserId = "676b8f9e123456789abcdef0";
        
        let cart = await Cart.findOne({ user: defaultUserId });
        
        if (!cart) {
            cart = new Cart({ user: defaultUserId, items: [] });
        }
        
        const existingItemIndex = cart.items.findIndex(item => item.product.toString() === id);
        
        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += qty;
        } else {
            cart.items.push({
                product: id,
                quantity: qty,
                price: price
            });
        }
        
        cart.totalAmount = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        
        await cart.save();
        res.status(201).json({ message: "Item added to cart successfully" });
    } catch (error) {
        console.error('Cart error:', error);
        res.status(400).json({ error: error.message });
    }
});

// Update cart item quantity
router.put("/:id", async (req, res) => {
    try {
        const { qty } = req.body;
        const productId = req.params.id;
        const defaultUserId = "676b8f9e123456789abcdef0";
        
        const cart = await Cart.findOne({ user: defaultUserId });
        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }
        
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (itemIndex === -1) {
            return res.status(404).json({ error: "Item not found in cart" });
        }
        
        cart.items[itemIndex].quantity = qty;
        cart.totalAmount = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        
        await cart.save();
        res.json({ message: "Cart updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Remove item from cart
router.delete("/:id", async (req, res) => {
    try {
        const productId = req.params.id;
        const defaultUserId = "676b8f9e123456789abcdef0";
        
        const cart = await Cart.findOne({ user: defaultUserId });
        if (!cart) {
            return res.status(404).json({ error: "Cart not found" });
        }
        
        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        cart.totalAmount = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
        
        await cart.save();
        res.json({ message: "Item removed successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Clear entire cart
router.delete("/", async (req, res) => {
    try {
        const defaultUserId = "676b8f9e123456789abcdef0";
        
        await Cart.findOneAndUpdate(
            { user: defaultUserId },
            { items: [], totalAmount: 0 },
            { upsert: true }
        );
        
        res.json({ message: "Cart cleared successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;