const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const User = require("./User");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  }),
);

mongoose
  .connect("mongodb://127.0.0.1:27017/studentDB")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB error:", err.message));

// Auth Middleware
function auth(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
}

// GET /login - show login form
app.get("/login", (req, res) => {
  res.send(`
    <h2>Login</h2>
    <form method="POST" action="/login">
      <input name="username" placeholder="Username" /><br/><br/>
      <input name="password" type="password" placeholder="Password" /><br/><br/>
      <button type="submit">Login</button>
    </form>
    <a href="/register">Register</a>
  `);
});

// GET /register - show register form
app.get("/register", (req, res) => {
  res.send(`
    <h2>Register</h2>
    <form method="POST" action="/register">
      <input name="username" placeholder="Username" /><br/><br/>
      <input name="password" type="password" placeholder="Password" /><br/><br/>
      <button type="submit">Register</button>
    </form>
    <a href="/login">Login</a>
  `);
});

// POST /register
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const user = new User(username, password);
  await user.register();
  // Auto login after register
  req.session.user = username;
  res.redirect("/dashboard");
});

// POST /login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = new User(username, password);
  const result = await user.login();
  if (result) {
    req.session.user = username;
    res.redirect("/dashboard");
  } else {
    res.send("Invalid username or password. <a href='/login'>Try again</a>");
  }
});

// GET /dashboard - protected
app.get("/dashboard", auth, (req, res) => {
  res.send(`
    <h2>Welcome ${req.session.user}</h2>
    <a href="/logout">Logout</a>
  `);
});

// GET /logout
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
