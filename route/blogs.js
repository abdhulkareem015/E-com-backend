const express = require("express");
const Blog = require("../models/Blog");
const User = require("../models/user");
const authMiddleware = require("../middleware/authmiddleware");
const router = express.Router();

// Get all blogs (public)
router.get("/", async (req, res) => {
    try {
        const blogs = await Blog.find({ published: true })
            .populate('author', 'name email')
            .sort({ createdAt: -1 });
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get blog by ID (public)
router.get("/:id", async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
            .populate('author', 'name email')
            .populate('comments.user', 'name email');
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }
        res.json(blog);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create new blog (protected - admin only)
router.post("/", authMiddleware, async (req, res) => {
    try {
        const { title, content, image, tags } = req.body;
        
        let authorId = req.userData.userId;
        
        // Handle admin user - create or find admin user
        if (req.userData.role === 'admin') {
            let adminUser = await User.findOne({ email: 'admin@blog.com' });
            if (!adminUser) {
                adminUser = await User.create({
                    email: 'admin@blog.com',
                    name: 'Admin',
                    password: 'dummy' // This won't be used for login
                });
            }
            authorId = adminUser._id;
        }
        
        const newBlog = new Blog({
            title,
            content,
            image,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            author: authorId
        });
        
        const savedBlog = await newBlog.save();
        const populatedBlog = await Blog.findById(savedBlog._id).populate('author', 'name email');
        res.status(201).json({ message: "Blog created successfully", blog: populatedBlog });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update blog (protected - admin only)
router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const { title, content, image, tags, published } = req.body;
        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            {
                title,
                content,
                image,
                tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
                published
            },
            { new: true }
        ).populate('author', 'name email');
        
        if (!updatedBlog) {
            return res.status(404).json({ error: "Blog not found" });
        }
        res.json({ message: "Blog updated successfully", blog: updatedBlog });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete blog (protected - admin only)
router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const deletedBlog = await Blog.findByIdAndDelete(req.params.id);
        if (!deletedBlog) {
            return res.status(404).json({ error: "Blog not found" });
        }
        res.json({ message: "Blog deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Like/Unlike blog
router.post("/:id/like", authMiddleware, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }

        const userId = req.userData.userId;
        const isLiked = blog.likes.includes(userId);

        if (isLiked) {
            blog.likes.pull(userId);
        } else {
            blog.likes.push(userId);
        }

        await blog.save();
        res.json({ 
            message: isLiked ? "Blog unliked" : "Blog liked", 
            likes: blog.likes.length,
            isLiked: !isLiked
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add comment to blog
router.post("/:id/comment", authMiddleware, async (req, res) => {
    try {
        const { content } = req.body;
        if (!content || !content.trim()) {
            return res.status(400).json({ error: "Comment content is required" });
        }

        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ error: "Blog not found" });
        }

        const newComment = {
            user: req.userData.userId,
            content: content.trim()
        };

        blog.comments.push(newComment);
        await blog.save();

        const populatedBlog = await Blog.findById(req.params.id)
            .populate('comments.user', 'name email');
        
        const addedComment = populatedBlog.comments[populatedBlog.comments.length - 1];
        res.status(201).json({ 
            message: "Comment added successfully", 
            comment: addedComment
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;