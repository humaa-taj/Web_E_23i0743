const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const User = require("./user");

const app = express();

app.use(express.json());

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  }),
);

mongoose.connect("mongodb://127.0.0.1:27017/studentDB");

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const user = new User(username, password);

  const result = await user.register();

  res.send(result);
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = new User(username, password);

  const result = await user.login();

  if (result) {
    req.session.user = username;
    res.send("Login successful");
  } else {
    res.send("Invalid login");
  }
});

function auth(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.send("Please login first");
  }
}

app.get("/dashboard", auth, (req, res) => {
  res.send("Welcome " + req.session.user);
});
