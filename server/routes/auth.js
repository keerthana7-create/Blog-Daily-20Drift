const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// Signup Page
router.get("/signup", (req, res) => {
  res.render("signup");
});

// Signup Handler
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();
    req.session.user = user;
    res.redirect("/");
  } catch (err) {
    res.status(500).send("Signup failed: " + err.message);
  }
});

// Login Page
router.get("/login", (req, res) => {
  res.render("login");
});

// Login Handler
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).send("Invalid credentials");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).send("Invalid credentials");

  req.session.user = user;
  res.redirect("/");
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/auth/login");
  });
});

module.exports = router;
