"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin_1 = __importDefault(require("../middleware/admin"));
const index_1 = require("../db/index");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
const AUTH_SECRET = process.env.AUTH_SECRET;
if (AUTH_SECRET === undefined) {
    throw new Error("AUTH_SECRET is not defined in the environment.");
}
// Admin Routes
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    //  Validate Body
    const errors = (0, index_1.validateUser)({ username, password });
    if (errors)
        return res.status(400).json(errors);
    //  Check existence
    const isExist = yield index_1.Admin.findOne({ username });
    if (isExist)
        return res.status(400).json({ message: "User already exist" });
    //  Create Admin
    const token = jsonwebtoken_1.default.sign({ username }, AUTH_SECRET);
    const newUser = new index_1.Admin({
        username,
        password,
    });
    try {
        const user = yield newUser.save();
        res.json({ username, token, _id: user._id });
    }
    catch (error) {
        res.status(500).json(error);
    }
}));
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    //  Validate Body
    const errors = (0, index_1.validateUser)({ username, password });
    if (errors)
        return res.status(400).json(errors);
    //  Check existence
    const user = yield index_1.Admin.findOne({ username });
    if (!user)
        return res.status(404).json({ message: "User not found" });
    if (user.password !== password)
        return res.status(401).json({ message: "Invalid Credentials" });
    //  Login Admin
    try {
        const token = jsonwebtoken_1.default.sign({ username }, AUTH_SECRET);
        res.json({ username, token, _id: user._id });
    }
    catch (error) {
        console.log(error);
        res.status(403).json({ message: "Unauthorized" });
    }
}));
router.post("/courses", admin_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reqBody = req.body;
    const { title, description, price, imageLink, admin } = reqBody;
    //  Validation
    const errors = (0, index_1.validateCourse)(req.body);
    if (errors)
        return res.status(400).json(errors);
    //  Create course structure
    const course = new index_1.Course({
        title,
        description,
        price,
        imageLink,
    });
    try {
        const result = yield course.save();
        res.json({
            message: "Course created successfully",
            courseId: result === null || result === void 0 ? void 0 : result._id,
        });
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong", error });
    }
}));
router.get("/courses", admin_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const courses = yield index_1.Course.find();
        res.json(courses);
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
}));
exports.default = router;
