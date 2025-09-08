import express, { Router } from "express";
import AuthController from "../../../controllers/globals/auth/authControllers";

const router: Router = express.Router();

router.route("/register").post(AuthController.registerUser);
router.route("/login").post(AuthController.loginUser);

export default router;
