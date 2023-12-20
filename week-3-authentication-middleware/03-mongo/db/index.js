const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect(
  "mongodb+srv://arpesh:arpesh@cluster0.vafdmo9.mongodb.net/week-3-1"
);

// Define schemas
const AdminSchema = new mongoose.Schema(
  {
    // Schema definition here
    username: String,
    password: String,
  },
  { timestamps: true }
);

const UserSchema = new mongoose.Schema(
  {
    // Schema definition here
    username: String,
    password: String,
  },
  { timestamps: true }
);

const CourseSchema = new mongoose.Schema({
  // Schema definition here
});

const Admin = mongoose.model("Admin", AdminSchema);
const User = mongoose.model("User", UserSchema);
const Course = mongoose.model("Course", CourseSchema);

module.exports = {
  Admin,
  User,
  Course,
};
