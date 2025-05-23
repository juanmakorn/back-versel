import express from "express";
import { AuthController } from "../controller/authController.js";

const authRoute = express.Router();

authRoute.post("/register", AuthController.register);
authRoute.post("/login", AuthController.login);
authRoute.post("/logout", AuthController.logout);

export default authRoute;