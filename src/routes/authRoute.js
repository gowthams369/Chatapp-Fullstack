import express from "express";
import { login, signUp } from "../controller/authController.js";

export const authRouter = express.Router();

authRouter.post("/user/signup", signUp);
authRouter.post("/user/login", login);
