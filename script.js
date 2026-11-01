
"use strict";

console.log("MyBlog frontend loaded successfully.");

const API_URL = "http://localhost:3000";

// Explore Articles button
const exploreLink = document.querySelector(".primary-button");

if (exploreLink && !exploreLink.closest("form")) {
  exploreLink.addEventListener("click", function () {
    console.log("User clicked Explore Articles");
  });
}

// Login form
const loginForm = document.querySelector("#loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value;
    const message = document.querySelector("#loginMessage");

    if (!email || !password) {
      message.textContent = "Please complete all fields.";
      return;
    }

    message.textContent = "Logging in...";

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        message.textContent = data.message || "Login failed.";
        return;
      }

      localStorage.setItem("loggedInUser", JSON.stringify(data.user));
      window.location.href = "dashboard.html";
    } catch (error) {
      message.textContent = "Cannot connect to backend.";
      console.error(error);
    }
  });
}

// Registration form
const registerForm = document.querySelector("#registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.querySelector("#name").value.trim();
    const email = document.querySelector("#registerEmail").value.trim();
    const password = document.querySelector("#registerPassword").value;
    const message = document.querySelector("#registerMessage");

    if (!name || !email || !password) {
      message.textContent = "Please complete all fields.";
      return;
    }

    if (password.length < 6) {
      message.textContent = "Password must be at least 6 characters.";
      return;
    }

    message.textContent = "Creating account...";

    try {
      const response = await fetch(`${API_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        message.textContent = data.message || "Registration failed.";
        return;
      }

      message.textContent = "Registration successful! You can now log in.";
      registerForm.reset();
    } catch (error) {
      message.textContent = "Cannot connect to backend.";
      console.error(error);
    }
  });
}

// Create Blog form — backend API
const createBlogForm = document.querySelector("#createBlogForm");

if (createBlogForm) {
  createBlogForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const title = document.querySelector("#blogTitle").value.trim();
    const category = document.querySelector("#blogCategory").value;
    const content = document.querySelector("#blogContent").value.trim();
    const message = document.querySelector("#blogMessage");

    if (!title || !category || !content) {
      message.textContent = "Please complete all fields.";
      return;
    }

    message.textContent = "Publishing blog...";

    try {
      const response = await fetch(`${API_URL}/api/blogs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category, content })
      });

      const data = await response.json();

      if (!response.ok) {
        message.textContent = data.message || "Could not create blog.";
        return;
      }

      message.textContent = "Blog published successfully!";
      createBlogForm.reset();
    } catch (error) {
      message.textContent = "Cannot connect to backend.";
      console.error(error);
    }
  });
}

// Articles — load blogs from backend
const articlesContainer = document.querySelector("#articlesContainer");

if (articlesContainer) {
  async function renderBlogs() {
    articlesContainer.textContent = "Loading articles...";

    try {
      const response = await fetch(`${API_URL}/api/blogs`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load articles.");
      }

      articlesContainer.replaceChildren();

      const blogs = data.blogs || [];

      if (blogs.length === 0) {
        articlesContainer.textContent =
          "You haven't published any articles yet.";
        return;
      }

      blogs.forEach(function (blog) {
        const article = document.createElement("article");
        const title = document.createElement("h3");
        const category = document.createElement("p");
        const content = document.createElement("p");
        const date = document.createElement("small");
        const deleteButton = document.createElement("button");

        title.textContent = blog.title;
        category.textContent = "Category: " + blog.category;
        content.textContent = blog.content;
        date.textContent = "Published: " + blog.createdAt;

        deleteButton.textContent = "Delete Blog";
        deleteButton.type = "button";

        deleteButton.addEventListener("click", async function () {
          deleteButton.disabled = true;

          try {
            const deleteResponse = await fetch(
              `${API_URL}/api/blogs/${blog.id}`,
              { method: "DELETE" }
            );

            const deleteData = await deleteResponse.json();

            if (!deleteResponse.ok) {
              throw new Error(deleteData.message || "Delete failed.");
            }

            await renderBlogs();
          } catch (error) {
            alert(error.message || "Could not delete blog.");
            deleteButton.disabled = false;
          }
        });

        article.append(title, category, content, date, deleteButton);
        articlesContainer.appendChild(article);
      });
    } catch (error) {
      articlesContainer.textContent =
        "Could not load articles. Check that the backend is running.";
      console.error(error);
    }
  }

  renderBlogs();
}
