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
const index_1 = require("../db/index");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AUTH_SECRET = process.env.AUTH_SECRET;
function userMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (AUTH_SECRET === undefined) {
            throw new Error("AUTH_SECRET is not defined in the environment.");
        }
        const token = req.headers.authorization;
        const jwtToken = token === null || token === void 0 ? void 0 : token.split(" ")[1];
        if (!token || !jwtToken)
            return res.status(401).json({ message: "Unauthorized" });
        try {
            const data = jsonwebtoken_1.default.verify(jwtToken, AUTH_SECRET);
            const user = yield index_1.User.findOne({
                username: typeof data === "string" ? "" : data === null || data === void 0 ? void 0 : data.username,
            });
            if (!user)
                return res.status(404).json({ message: "User not fount" });
            req.body.user = user;
            next();
        }
        catch (error) {
            return res.status(401).json({ message: "Unauthorized" });
        }
    });
}
exports.default = userMiddleware;
