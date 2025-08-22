import express from "express";
import { login, logout, signUp } from "../controller/authController.js";

export const authRouter = express.Router();

authRouter.post("/user/signup", signUp);
authRouter.post("/user/login", login);
authRouter.post("/user/logout", logout);
