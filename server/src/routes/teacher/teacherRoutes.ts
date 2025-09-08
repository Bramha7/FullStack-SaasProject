import express, { Router } from "express";
import { teacherLogin } from "../../controllers/teacher/teacher.controllers";

const router: Router = express.Router();
router.post("/login", teacherLogin);

export default router;
