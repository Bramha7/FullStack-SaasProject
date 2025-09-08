import express, { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategory,
} from "../../../controllers/institute/category/category.controller";
import isLoggedIn from "../../../middlewares/middlewares";
import asyncErrorHandler from "../../../services/asyncErrorHandling";

const router: Router = express.Router();

router.post("/create", isLoggedIn, createCategory);
router.get("/fetch", isLoggedIn, getCategory);
router.delete("/delete/:id", isLoggedIn, asyncErrorHandler(deleteCategory));

export default router;
