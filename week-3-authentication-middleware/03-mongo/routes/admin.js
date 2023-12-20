const { Router } = require("express");
const router = Router();
const { adminMiddleware, validateAdminSignUp } = require("../middleware/admin");
const { Admin } = require("../db/index");

// Admin Routes
router.post("/signup", (req, res) => {
  const { username, password } = req.body;

  //  Validation
  const errors = validateAdminSignUp({ username, password });
  if (errors) return res.status(400).json(errors);

  //  Create admin structure
  const admin = new Admin({
    username,
    password,
  });

  //  Save to DB
  admin.save();
  res.json(admin);
});

router.post("/courses", adminMiddleware, (req, res) => {
  // Implement course creation logic
});

router.get("/courses", adminMiddleware, (req, res) => {
  // Implement fetching all courses logic
});

module.exports = router;
