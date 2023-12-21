const { Router } = require("express");
const router = Router();
const { validateCourse, validateUser } = require("../db/index");
const adminMiddleware = require("../middleware/admin");
const { Admin, Course } = require("../db/index");

// Admin Routes
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  //  Validation
  const errors = validateUser({ username, password });
  if (errors) return res.status(400).json(errors);

  //  Validate if user exists
  const isExist = await Admin.findOne({ username });
  if (isExist) return res.status(400).json({ message: "User already exist" });

  //  Create admin structure
  const admin = new Admin({
    username,
    password,
  });

  try {
    //  Save to DB
    const result = await admin.save();
    res.json({ message: "Admin created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", error });
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
    res.json({ course: courses });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

module.exports = router;
