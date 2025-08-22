import express from "express";
import { signUp } from "../controller/authController.js";

export const authRouter = express.Router();

authRouter.post("/user/signup", signUp);
