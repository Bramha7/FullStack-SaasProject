import express, { Router } from "express";
import isLoggedIn from "../../../middlewares/middlewares";
import {
  createTeacher,
  deleteTeacher,
  getTeacher,
  getTeacherPasswords,
} from "../../../controllers/institute/teacher/teacher.controller";
import upload from "../../../middlewares/multer/multerUpload";
import asyncErrorHandler from "../../../services/asyncErrorHandling";

const router: Router = express.Router();

router.post(
  "/create",
  isLoggedIn,
  upload.single("teacherPhoto"),

  asyncErrorHandler(createTeacher),
);
router.get("/fetch", isLoggedIn, getTeacher);

router.get("/password", isLoggedIn, getTeacherPasswords);
router.delete("/delete/:id", isLoggedIn, deleteTeacher);

export default router;
