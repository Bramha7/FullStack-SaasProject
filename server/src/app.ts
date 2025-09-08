import express from "express";
import router from "./routes/globals/auth/authRoute";
import instituteRouter from "./routes/institute/institute.routes";
import courseRoute from "./routes/institute/course/course.route";
import categoryroute from "./routes/institute/category/category.routes";
import createteacher from "./routes/institute/teacher/teacher.route";
import teacherlogin from "../src/routes/teacher/teacherRoutes";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
  }),
);

// middleware setup
app.use("/api/auth", router);
app.use("/api/institute", instituteRouter);
app.use("/api/institute/course", courseRoute);
// category middleware
app.use("/api/institute/category", categoryroute);
// institute teacher creation middleware setup
app.use("/api/institute/teacher", createteacher);
// teacher login
app.use("/api/teacher", teacherlogin);

export default app;
