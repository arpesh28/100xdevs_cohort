const mongoose = require("mongoose");
const zod = require("zod");

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI);

const getErrors = (errors) => {
  return errors?.map((err) => ({
    [err.path[0]]: err.message,
  }));
};

// Define schemas
const AdminSchema = new mongoose.Schema(
  {
    // Schema definition here
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const UserSchema = new mongoose.Schema(
  {
    // Schema definition here
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  { timestamps: true }
);

const CourseSchema = new mongoose.Schema({
  // Schema definition here
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  imageLink: {
    type: String,
    required: true,
  },
});

const validateUser = (adminData) => {
  const schema = zod.object({
    username: zod.string(),
    password: zod.string(),
  });
  const validate = schema.safeParse(adminData);
  if (validate.success) return false;
  return getErrors(validate?.error?.errors);
};

const validateCourse = (course) => {
  const schema = zod.object({
    title: zod.string(),
    description: zod.string(),
    price: zod.number(),
    imageLink: zod.string().url(),
  });

  const validate = schema.safeParse(course);
  if (validate.success) return false;
  return getErrors(validate.error.errors);
};

const Admin = mongoose.model("Admin", AdminSchema);
const User = mongoose.model("User", UserSchema);
const Course = mongoose.model("Course", CourseSchema);

module.exports = {
  Admin,
  User,
  Course,
  validateUser,
  validateCourse,
};
