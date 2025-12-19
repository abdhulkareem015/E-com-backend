const express=require("express");
const fs=require("fs");
const router=express.Router();

router.get("/",(req,res) => {
    const orders=fs.readFileSync("data/orders.json");
    res.json(JSON.parse(orders));
});

router.post("/", (req, res) => {
    const orders = JSON.parse(fs.readFileSync("data/orders.json"));
    const newOrder = {
        id: orders.length + 1,
        ...req.body
    };
    
    orders.push(newOrder);
    fs.writeFileSync("data/orders.json", JSON.stringify(orders, null, 2));
    res.status(201).json({message:"Order placed successfully"});
});

router.delete("/:id", (req, res) => {
    const orders = JSON.parse(fs.readFileSync("data/orders.json"));
    const orderId = parseInt(req.params.id);
    const updatedOrders = orders.filter(order => order.id !== orderId);
    
    fs.writeFileSync("data/orders.json", JSON.stringify(updatedOrders, null, 2));
    res.json({ message: "Order cancelled successfully" });
});

// Clear cart endpoint
router.delete("/cart", (req, res) => {
    fs.writeFileSync("data/cart.json", JSON.stringify([], null, 2));
    res.json({ message: "Cart cleared successfully" });
});

module.exports=router;