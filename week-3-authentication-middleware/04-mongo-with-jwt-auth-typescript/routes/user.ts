import { Router } from "express";
const router = Router();
import userMiddleware from "../middleware/user";
import { User, validateUser, Course } from "../db/index";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const AUTH_SECRET: string | undefined = process.env.AUTH_SECRET;
if (AUTH_SECRET === undefined) {
  throw new Error("AUTH_SECRET is not defined in the environment.");
}

// User Routes
router.post("/signup", async (req, res) => {
  const { username, password } = req.body;

  //  Validate Body
  const errors = validateUser({ username, password });
  if (errors) return res.status(400).json(errors);

  //  Check existence
  const isExist = await User.findOne({ username });
  if (isExist) return res.status(400).json({ message: "User already exist" });

  //  Create Admin
  const token = jwt.sign({ username }, AUTH_SECRET);
  const newUser = new User({
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
  const user = await User.findOne({ username });
  if (!user) return res.status(404).json({ message: "User not found" });

  if (user.password !== password)
    return res.status(401).json({ message: "Invalid Credentials" });

  //  Login Admin
  try {
    const token = jwt.sign({ username }, AUTH_SECRET);
    res.json({ username, token, _id: user._id });
  } catch (error) {
    console.log(error);
    res.status(403).json({ message: "Unauthorized" });
  }
});

router.get("/courses", async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.post("/courses/:courseId", userMiddleware, async (req, res) => {
  const { courseId } = req.params;
  const user = req.body.user;

  if (!mongoose.Types.ObjectId.isValid(courseId))
    return res.status(400).json({ message: "Invalid course id" });

  //  Find course
  const course = await Course.findById(courseId);
  if (!course) return res.status(404).json({ message: "Course not found" });

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
  // console.log(req.body.user);
  try {
    const user = await User.findById(req.body.user._id).populate("courses");
    res.json(user?.courses);
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

export default router;
