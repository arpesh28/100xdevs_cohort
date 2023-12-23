import mongoose from "mongoose";
import zod from "zod";
import { CourseType, UserType } from "../types/data";

const MONGO_URI: string | undefined = process.env.MONGO_URI;

if (MONGO_URI === undefined) {
  throw new Error("MONGO_URI is not defined in the environment.");
}

// Connect to MongoDB
mongoose.connect(MONGO_URI);

// Define schemas
const AdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const UserSchema = new mongoose.Schema({
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
      type: mongoose.Schema.ObjectId,
      ref: "Course",
    },
  ],
});

const CourseSchema = new mongoose.Schema({
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

const getErrors = (errors: any) => {
  return errors?.map((err: { path: number[]; message: string }) => ({
    [err.path[0]]: err.message,
  }));
};

export const validateUser = (adminData: UserType) => {
  const schema = zod.object({
    username: zod.string(),
    password: zod.string(),
  });
  const validate = schema.safeParse(adminData);
  if (validate.success) return false;
  return getErrors(validate?.error?.errors);
};

export const validateCourse = (course: CourseType) => {
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

export const Admin = mongoose.model("Admin", AdminSchema);
export const User = mongoose.model("User", UserSchema);
export const Course = mongoose.model("Course", CourseSchema);
