const zod = require("zod");
const { validateUser, User } = require("../db");

async function userMiddleware(req, res, next) {
  const { username, password } = req.headers;

  const errors = validateUser({ username, password });
  if (errors) return res.status(400).json(errors);

  const user = await User.findOne({ username, password });
  if (!user) return res.status(403).json({ message: "Unauthorized" });

  req.body.user = user;
  next();
}

module.exports = userMiddleware;
