const { Router } = require("express");
const router = Router();
const adminMiddleware = require("../middleware/admin");

// Admin Routes
router.post("/signup", (req, res) => {
  // Implement admin signup logic
});

router.post("/courses", adminMiddleware, (req, res) => {
  // Implement course creation logic
});

router.get("/courses", adminMiddleware, (req, res) => {
  // Implement fetching all courses logic
});

module.exports = router;
