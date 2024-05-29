import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import UsersRouter from "./routers/users.router.js";
import ResumeRouter from "./routers/resumes.router.js";
import errorHandler from "./middlewares/error-handling.middleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

// 라우터 설정
app.use("/api/users", UsersRouter);
app.use("/api/resumes", ResumeRouter);

// 에러 핸들러 미들웨어 설정
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
