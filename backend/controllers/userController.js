import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ✅ Register User
export const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log("📝 Registration attempt for username:", username);

    // Validation
    if (!username || !password) {
      return res.status(400).json({ 
        success: false,
        message: "All fields are required" 
      });
    }

    // Check for existing user (case-insensitive)
    const existingUser = await User.findOne({
      username: { $regex: new RegExp("^" + username + "$", "i") }
    });

    console.log("🔍 Existing user check result:", existingUser);

    if (existingUser) {
      console.log("❌ User already exists in database");
      return res.status(400).json({ 
        success: false,
        message: "Username already exists. Please choose a different username.",
        debug: {
          requestedUsername: username,
          existingUsername: existingUser.username
        }
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      username,
      password: hashedPassword
    });

    console.log("✅ New user created:", newUser.username);

    // Generate token
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });

    res.status(201).json({
      success: true, // ✅ Added this
      message: "User registered successfully",
      user: { id: newUser._id, username: newUser.username },
      token
    });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Error registering user", 
      error: error.message 
    });
  }
};

// ✅ Login User
export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password)
      return res.status(400).json({ 
        success: false,
        message: "All fields are required" 
      });

    const user = await User.findOne({ username });
    if (!user)
      return res.status(400).json({ 
        success: false,
        message: "User not found" 
      });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ 
        success: false,
        message: "Invalid credentials" 
      });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h"
    });

    res.json({
      success: true, // ✅ Added this
      message: "Login successful",
      token,
      user: { id: user._id, username: user.username }
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ 
      success: false,
      message: "Login error", 
      error: error.message 
    });
  }
};