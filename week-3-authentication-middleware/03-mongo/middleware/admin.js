const { Admin, validateUser } = require("../db/index");

// Middleware for handling auth
const adminMiddleware = async (req, res, next) => {
  const { username, password } = req.headers;

  //  Validation
  const errors = validateUser({ username, password });
  if (errors) return res.status(400).json(errors);

  //  Check for Admin
  const admin = await Admin.findOne({ username, password });

  if (!admin) return res.status(403).json({ message: "Invalid Credentials" });

  req.body.admin = admin;
  next();
};

module.exports = adminMiddleware;
