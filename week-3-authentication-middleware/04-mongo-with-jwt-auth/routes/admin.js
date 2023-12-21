const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { validateUser, Admin, Course, validateCourse } = require("../db");
const router = Router();
const jwt = require("jsonwebtoken");

// Admin Routes
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  //  Validate Body
  const errors = validateUser({ username, password });
  if (errors) return res.status(400).json(errors);

  //  Check existence
  const isExist = await Admin.findOne({ username });
  if (isExist) return res.status(400).json({ message: "User already exist" });

  //  Create Admin
  const token = jwt.sign({ username }, process.env.AUTH_SECRET);
  const newUser = Admin({
    username,
    password,
  });
  try {
    const user = await newUser.save();
    res.json({ username, token, _id: user._id });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/signin", async (req, res) => {
  const { username, password } = req.body;

  //  Validate Body
  const errors = validateUser({ username, password });
  if (errors) return res.status(400).json(errors);

  //  Check existence
  const user = await Admin.findOne({ username });
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.password !== password)
    return res.status(401).json({ message: "Invalid Credentials" });

  //  Login Admin
  try {
    const token = jwt.sign({ username }, process.env.AUTH_SECRET);
    res.json({ username, token, _id: user._id });
  } catch (error) {
    console.log(error);
    res.status(403).json({ message: "Unauthorized" });
  }
});

router.post("/courses", adminMiddleware, async (req, res) => {
  const reqBody = req.body;
  const { title, description, price, imageLink, admin } = reqBody;
  //  Validation
  const errors = validateCourse(req.body);
  if (errors) return res.status(400).json(errors);

  //  Create course structure
  const course = new Course({
    title,
    description,
    price,
    imageLink,
  });

  try {
    const result = await course.save();
    res.json({
      message: "Course created successfully",
      courseId: result?._id,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
  }
});

router.get("/courses", adminMiddleware, async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
