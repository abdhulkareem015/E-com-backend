const Cart = require('../models/Cart');
const Product = require('../models/Product');

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.userData.id }).populate('items.product');
    res.json(cart || { items: [], totalAmount: 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addToCart = async (req, res) => {
  console.log('=== MONGODB CONTROLLER CALLED ===');
  try {
    const { productId, quantity = 1 } = req.body;
    console.log('Adding to cart:', { productId, quantity, userId: req.userData.id });
    
    const product = await Product.findById(productId);
    console.log('Found product:', product);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const productData = product.toObject();
    const price = productData.price || productData.selling_price;
    console.log('Price found:', price);
    if (!price) {
      return res.status(400).json({ message: 'Product price not available' });
    }

    let cart = await Cart.findOne({ user: req.userData.id });
    if (!cart) {
      cart = new Cart({ user: req.userData.id, items: [] });
    }

    const existingItem = cart.items.find(item => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity, price });
    }

    cart.totalAmount = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    const savedCart = await cart.save();
    console.log('Cart saved:', savedCart);
    
    // Verify it was actually saved
    const verifyCart = await Cart.findOne({ user: req.userData.id });
    console.log('Verification - cart in DB:', verifyCart);
    
    await cart.populate('items.product');
    res.json({ message: "Item added to cart successfully", cart });
  } catch (error) {
    console.error('Cart error:', error);
    res.status(500).json({ message: error.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const item = cart.items.find(item => item.product.toString() === req.params.productId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter(item => item.product.toString() !== req.params.productId);
    } else {
      item.quantity = quantity;
    }

    cart.totalAmount = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    await cart.save();
    await cart.populate('items.product');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.product.toString() !== req.params.productId);
    cart.totalAmount = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart
};



// const Cart = require("../models/cart");
// const Product = require("../models/Product");

// const getCart = async (req, res) => {
//   const cart = await Cart.findOne({ user: req.user._id })
//     .populate("products.product");
  
//   if (!cart) {
//     return res.status(200).json({ message: "Cart not found", cart: [] });
//   }
  
//   res.status(200).json({ cart });
// };

// const addToCart = async (req, res) => {
//   const { productId, quantity } = req.body;
//   const cart = await Cart.findOne({ user: req.user._id });

//   if(!cart) {
//     // create a cart and add
//     const newCart = await Cart.create({ user: req.user._id, products: [{ product: productId, quantity }] });
//     return res.status(200).json({ message: "Cart created", cart: newCart });
//   }
//   const product = await Product.findById(productId);
//   if(!product) {
//     return res.status(404).json({ error: "Product not found" });
//   }
//   cart.products.push({ product: productId, quantity });
//   await cart.save();
//   res.status(200).json({ message: "Product added to cart", cart });
// }

// module.exports = { getCart, addToCart };


