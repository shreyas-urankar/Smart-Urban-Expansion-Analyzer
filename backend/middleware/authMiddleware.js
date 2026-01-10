// backend/middleware/authMiddleware.js
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "❌ Access denied. No token provided." });
  }
  
  const token = authHeader.split(" ")[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("❌ Token Verification Error:", error);
    res.status(403).json({ message: "❌ Invalid or expired token." });
  }
};

// New: Verify token for Streamlit API calls
export const verifyTokenForAPI = (req, res, next) => {
  // Try multiple ways to get token
  let token = null;
  
  // 1. From Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }
  // 2. From query parameters (for Streamlit iframe)
  else if (req.query.token) {
    token = req.query.token;
  }
  // 3. From body
  else if (req.body && req.body.token) {
    token = req.body.token;
  }
  
  if (!token) {
    return res.status(401).json({ 
      success: false,
      message: "❌ Access denied. No token provided." 
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("❌ Token Verification Error:", error);
    res.status(403).json({ 
      success: false,
      message: "❌ Invalid or expired token." 
    });
  }
};