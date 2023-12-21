const { Admin } = require("../db");
const jwt = require("jsonwebtoken");

// Middleware for handling auth
async function adminMiddleware(req, res, next) {
  const token = req.headers.authorization;
  const jwtToken = token?.split(" ")[1];
  if (!token || !jwtToken)
    return res.status(401).json({ message: "Unauthorized" });

  try {
    const data = jwt.verify(jwtToken, process.env.AUTH_SECRET);
    const user = await Admin.findOne({ username: data.username });
    if (!user) return res.status(404).json({ message: "User not fount" });
    req.body.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = adminMiddleware;
