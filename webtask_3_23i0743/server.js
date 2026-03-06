const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const User = require("./User");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);

mongoose
  .connect("mongodb://127.0.0.1:27017/studentDB")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB error:", err.message));

// ─── Auth Middleware ───────────────────────────────────────────────────────────
function auth(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/");
  }
}

// ─── Pages ─────────────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  if (req.session.user) return res.redirect("/dashboard");
  res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.get("/register-page", (req, res) => {
  if (req.session.user) return res.redirect("/dashboard");
  res.sendFile(path.join(__dirname, "views", "register.html"));
});

app.get("/dashboard", auth, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "dashboard.html"));
});

// ─── API Routes ────────────────────────────────────────────────────────────────
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = new User(username, password);
    const result = await user.register();
    res.json({ success: true, message: result });
  } catch (err) {
    res.json({ success: false, message: "Registration failed: " + err.message });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = new User(username, password);
    const result = await user.login();
    if (result) {
      req.session.user = username;
      res.json({ success: true, message: "Login successful" });
    } else {
      res.json({ success: false, message: "Invalid username or password" });
    }
  } catch (err) {
    res.json({ success: false, message: "Login failed: " + err.message });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

app.get("/session-user", auth, (req, res) => {
  res.json({ username: req.session.user });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
