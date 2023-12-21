const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { validateUser, User, Course } = require("../db/index");
const mongoose = require("mongoose");

// User Routes
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  //  Validate User
  const errors = validateUser({ username, password });
  if (errors) return res.status(400).json(errors);

  //  Validate if user exists
  const isExist = await User.findOne({ username });
  if (isExist) return res.status(400).json({ message: "User already exists" });

  //  Create user structure
  const user = new User({
    username,
    password,
  });

  try {
    //  Save user to db
    const result = user.save();
    return res.json({ message: "User created successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
});

router.get("/courses", userMiddleware, async (req, res) => {
  try {
    const result = await Course.find();
    return res.json({ courses: result });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong" });
  }
});

router.post("/courses/:courseId", userMiddleware, async (req, res) => {
  const { courseId } = req.params;
  const { user } = req.body;

  if (!mongoose.Types.ObjectId.isValid(courseId))
    return res.status(400).json({ message: "Invalid course id" });

  //  Find course
  const course = await Course.findById(courseId);
  if (!course) return res.status(401).json({ message: "Course not found" });

  try {
    await User.findByIdAndUpdate(user?._id, {
      $push: { courses: course?._id },
    });
    return res.json({ message: "Course purchased successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get("/purchasedCourses", userMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.body.user._id).populate("courses");
    res.json(user.courses);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
