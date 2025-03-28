const jwt = require("jsonwebtoken");

const isLogin = (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);
    
    req.userId = decoded.userId; // Attach userId to request object

    next(); // Move to next middleware or route
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = isLogin;
