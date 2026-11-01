const express = require("express");
const bcrypt = require("bcryptjs");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Temporary storage
// Server restart hone par data delete ho jayega.
const users = [];
const blogs = [];

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "MyBlog Backend API is running!"
  });
});

// ==============================
// 1. User Registration API
// ==============================
app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = users.find(
      user => user.email === normalizedEmail
    );

    if (existingUser) {
      return res.status(409).json({
        message: "Email already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: users.length + 1,
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword
    };

    users.push(newUser);

    return res.status(201).json({
      message: "Registration successful!",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
});

// ==============================
// 2. User Login API
// ==============================
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = users.find(
      user => user.email === normalizedEmail
    );

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    return res.status(200).json({
      message: "Login successful!",
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
});

// ==============================
// 3. Create Blog API
// ==============================
app.post("/api/blogs", (req, res) => {
  try {
    const { title, category, content } = req.body;

    if (
      typeof title !== "string" ||
      typeof category !== "string" ||
      typeof content !== "string" ||
      !title.trim() ||
      !category.trim() ||
      !content.trim()
    ) {
      return res.status(400).json({
        message: "Title, category and content are required"
      });
    }

    const newBlog = {
      id: Date.now(),
      title: title.trim(),
      category: category.trim(),
      content: content.trim(),
      createdAt: new Date().toLocaleDateString()
    };

    blogs.push(newBlog);

    return res.status(201).json({
      message: "Blog created successfully!",
      blog: newBlog
    });
  } catch (error) {
    console.error("Create blog error:", error);

    return res.status(500).json({
      message: "Internal server error"
    });
  }
});

// ==============================
// 4. Get All Blogs API
// ==============================
app.get("/api/blogs", (req, res) => {
  return res.status(200).json({
    blogs: blogs
  });
});
// Delete Blog API
app.delete("/api/blogs/:id", (req, res) => {
  const blogId = Number(req.params.id);

  const blogIndex = blogs.findIndex(
    blog => blog.id === blogId
  );

  if (blogIndex === -1) {
    return res.status(404).json({
      message: "Blog not found"
    });
  }

  blogs.splice(blogIndex, 1);

  return res.status(200).json({
    message: "Blog deleted successfully!"
  });
});
// Server start
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});