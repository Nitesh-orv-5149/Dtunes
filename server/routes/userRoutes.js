const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { hashPassword, comparePassword } = require("../authUtils");

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await hashPassword(password);
  const user = await User.create({ username, email, password: hashedPassword });
  res.status(201).json(user);
});

router.post("/signin", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid username or password" });
  }
  
  // Update the user's signedIn status to true
  await User.findByIdAndUpdate(user._id, { signedIn: true });
  
  // Get the updated user data
  const updatedUser = await User.findById(user._id);
  
  res.status(200).json({ user: updatedUser, isPasswordValid });
});

router.post("/signout", async (req, res) => {
  const { username } = req.body;
  const user = await User.findOne({ username });
  
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  
  try {
    await User.findByIdAndUpdate(user._id, { signedIn: false });
    res.status(200).json({ message: "Signed out successfully" });
  } catch (error) {
    console.error("Signout error:", error);
    res.status(500).json({ message: "Error signing out", error: error.message });
  }
});



module.exports = router;
