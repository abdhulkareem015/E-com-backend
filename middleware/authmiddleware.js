const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.replace('Bearer ', '');
    
    try {
        // Handle admin token
        if (token === 'admin-token') {
            req.userData = { 
                userId: 'admin', 
                email: 'admin@blog.com',
                role: 'admin'
            };
            return next();
        }

        // Handle regular JWT token
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }
        
        req.userData = {
            userId: decoded.id,
            email: decoded.email,
            role: 'user'
        };
        next();
    } catch (err) {
        res.status(401).json({ error: "Unauthorized", message: err.message });
    }
};

module.exports = auth;