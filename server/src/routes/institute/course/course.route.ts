import express, { Request, Router } from "express";
import isLoggedIn from "../../../middlewares/middlewares";
import asyncErrorHandler from "../../../services/asyncErrorHandling";
import {
  createCourse,
  deleteCourse,
  getAllCourse,
  getSingleCourse,
} from "../../../controllers/institute/course/course.controller";
// import { storage, multer } from "../../../middlewares/multer/multer.middleware";
// multer setup
// const upload = multer({ storage: storage });

import { cloudinary, storage } from "../../../services/cloudinary.config";
import upload from "../../../middlewares/multer/multerUpload";
const courses: Router = express.Router();

// CREATE
courses.post(
  "/create",
  isLoggedIn,
  upload.single("courseThubnail"),
  createCourse,
);

// DELETE (should include course id in the URL)
courses.delete("/delete/:id", isLoggedIn, asyncErrorHandler(deleteCourse));

// GET SINGLE COURSE (should include course id in the URL)
courses.get(
  "/singlecourse/:id",
  isLoggedIn,
  asyncErrorHandler(getSingleCourse),
);

// GET ALL COURSES
courses.get("/all", isLoggedIn, asyncErrorHandler(getAllCourse));

export default courses;
