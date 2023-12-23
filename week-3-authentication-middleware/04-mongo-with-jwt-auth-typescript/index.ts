import express from "express";
import dotenv from "dotenv";
dotenv.config();
import bodyParser from "body-parser";
const app = express();
import adminRouter from "./routes/admin";
import userRouter from "./routes/user";

// Middleware for parsing request bodies
app.use(bodyParser.json());
app.use("/admin", adminRouter);
app.use("/user", userRouter);

//  Port
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
