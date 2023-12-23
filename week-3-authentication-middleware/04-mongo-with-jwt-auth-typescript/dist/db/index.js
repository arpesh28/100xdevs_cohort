"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Course = exports.User = exports.Admin = exports.validateCourse = exports.validateUser = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = __importDefault(require("zod"));
const MONGO_URI = process.env.MONGO_URI;
if (MONGO_URI === undefined) {
    throw new Error("MONGO_URI is not defined in the environment.");
}
// Connect to MongoDB
mongoose_1.default.connect(MONGO_URI);
// Define schemas
const AdminSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
});
const UserSchema = new mongoose_1.default.Schema({
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
            type: mongoose_1.default.Schema.ObjectId,
            ref: "Course",
        },
    ],
});
const CourseSchema = new mongoose_1.default.Schema({
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
const getErrors = (errors) => {
    return errors === null || errors === void 0 ? void 0 : errors.map((err) => ({
        [err.path[0]]: err.message,
    }));
};
const validateUser = (adminData) => {
    var _a;
    const schema = zod_1.default.object({
        username: zod_1.default.string(),
        password: zod_1.default.string(),
    });
    const validate = schema.safeParse(adminData);
    if (validate.success)
        return false;
    return getErrors((_a = validate === null || validate === void 0 ? void 0 : validate.error) === null || _a === void 0 ? void 0 : _a.errors);
};
exports.validateUser = validateUser;
const validateCourse = (course) => {
    const schema = zod_1.default.object({
        title: zod_1.default.string(),
        description: zod_1.default.string(),
        price: zod_1.default.number(),
        imageLink: zod_1.default.string().url(),
    });
    const validate = schema.safeParse(course);
    if (validate.success)
        return false;
    return getErrors(validate.error.errors);
};
exports.validateCourse = validateCourse;
exports.Admin = mongoose_1.default.model("Admin", AdminSchema);
exports.User = mongoose_1.default.model("User", UserSchema);
exports.Course = mongoose_1.default.model("Course", CourseSchema);
