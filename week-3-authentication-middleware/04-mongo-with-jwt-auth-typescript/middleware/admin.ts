import { Admin } from "../db/index";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const AUTH_SECRET: string | undefined = process.env.AUTH_SECRET;
// Middleware for handling auth
export default async function adminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (AUTH_SECRET === undefined) {
    throw new Error("AUTH_SECRET is not defined in the environment.");
  }
  const token = req.headers.authorization;
  const jwtToken = token?.split(" ")[1];
  if (!token || !jwtToken)
    return res.status(401).json({ message: "Unauthorized" });

  try {
    const data = jwt.verify(jwtToken, AUTH_SECRET);
    const user = await Admin.findOne({
      username: typeof data === "string" ? "" : data?.username,
    });
    if (!user) return res.status(404).json({ message: "User not fount" });
    req.body.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
