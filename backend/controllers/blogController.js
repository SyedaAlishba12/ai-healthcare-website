import Blog from "../models/Blog.js";

// @desc    Get all blogs or filter blogs by category
// @route   GET /api/blogs
// @route   GET /api/blogs?category=Health Tips
export const getBlogs = async (req, res) => {
  try {
    const { category } = req.query;

    const filter = category ? { category } : {};

    const blogs = await Blog.find(filter).sort({ publishedDate: -1 });

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch blogs",
      error: error.message,
    });
  }
};

// @desc    Get a single blog by ID
// @route   GET /api/blogs/:id
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    res.status(200).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch blog",
      error: error.message,
    });
  }
};

// @desc    Create a new blog
// @route   POST /api/blogs
export const createBlog = async (req, res) => {
  try {
    const { title, description, content, category, image, author, publishedDate, readTime } = req.body;

    if (!title || !description || !content || !category || !image) {
      return res.status(400).json({
        success: false,
        message: "Missing required blog fields",
      });
    }

    const blog = await Blog.create({
      title,
      description,
      content,
      category,
      image,
      author,
      publishedDate,
      readTime,
    });

    res.status(201).json({
      success: true,
      data: blog,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create blog",
      error: error.message,
    });
  }
};