import express, { Router } from "express";
import isLoggedIn from "../../middlewares/middlewares";
import {
  createTeacherTable,
  createStudentTable,
  createCourseTable,
  InstituteController,
  createCategoryTable,
} from "../../controllers/institute/institute.controller";

const router: Router = express.Router();

router.post(
  "/create",
  isLoggedIn,
  InstituteController.createInstitute,
  createTeacherTable,
  createStudentTable,
  createCategoryTable,
  createCourseTable,
);

export default router;
