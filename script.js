
"use strict";

console.log("MyBlog frontend loaded successfully.");

// Explore Articles button
const exploreLink = document.querySelector(".primary-button");

if (exploreLink) {
  exploreLink.addEventListener("click", function () {
    console.log("User clicked Explore Articles");
  });
}

// Login form validation
const loginForm = document.querySelector("#loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value;
    const message = document.querySelector("#loginMessage");

    if (!email || !password) {
      message.textContent = "Please complete all fields.";
      return;
    }

    message.textContent =
      "Form validation successful. Backend authentication is not connected yet.";
  });
}



const registerForm = document.querySelector("#registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", function (event) {
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

    message.textContent =
      "Form validation successful. Backend registration is not connected yet.";
  });
}


const createBlogForm = document.querySelector("#createBlogForm");

if (createBlogForm) {
  createBlogForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const title = document.querySelector("#blogTitle").value.trim();
    const category = document.querySelector("#blogCategory").value;
    const content = document.querySelector("#blogContent").value.trim();
    const message = document.querySelector("#blogMessage");

    if (!title || !category || !content) {
      message.textContent = "Please complete all fields.";
      return;
    }

    const blog = {
      id: Date.now(),
      title: title,
      category: category,
      content: content,
      createdAt: new Date().toLocaleDateString()
    };

    const blogs = JSON.parse(localStorage.getItem("myBlogs")) || [];

    blogs.push(blog);

    localStorage.setItem("myBlogs", JSON.stringify(blogs));

    message.textContent = "Blog saved successfully!";

    createBlogForm.reset();
  });
}


const articlesContainer = document.querySelector("#articlesContainer");

if (articlesContainer) {
  const blogs = JSON.parse(localStorage.getItem("myBlogs")) || [];

  if (blogs.length === 0) {
    articlesContainer.textContent = "You haven't published any articles yet.";
  } else {
    articlesContainer.replaceChildren();

    blogs.forEach(function (blog) {
      const article = document.createElement("article");
      const title = document.createElement("h3");
      const category = document.createElement("p");
      const content = document.createElement("p");
      const date = document.createElement("small");

      title.textContent = blog.title;
      category.textContent = "Category: " + blog.category;
      content.textContent = blog.content;
      date.textContent = "Published: " + blog.createdAt;

      article.append(title, category, content, date);
      articlesContainer.appendChild(article);
    });
  }
}


const articlesContainer = document.querySelector("#articlesContainer");

if (articlesContainer) {
  const blogs = JSON.parse(localStorage.getItem("myBlogs")) || [];

  function renderBlogs() {
    articlesContainer.replaceChildren();

    const savedBlogs = JSON.parse(localStorage.getItem("myBlogs")) || [];

    if (savedBlogs.length === 0) {
      articlesContainer.textContent =
        "You haven't published any articles yet.";
      return;
    }

    savedBlogs.forEach(function (blog) {
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

      deleteButton.addEventListener("click", function () {
        const updatedBlogs = (
          JSON.parse(localStorage.getItem("myBlogs")) || []
        ).filter(function (item) {
          return item.id !== blog.id;
        });

        localStorage.setItem("myBlogs", JSON.stringify(updatedBlogs));
        renderBlogs();
      });

      article.append(title, category, content, date, deleteButton);
      articlesContainer.appendChild(article);
    });
  }

  renderBlogs();
}
