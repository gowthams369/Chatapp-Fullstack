import express from "express";
import {
  checkAuth,
  login,
  logout,
  signUp,
  updateProfile,
} from "../controller/authController.js";
import { userAuth } from "../middleware/authMiddleware.js";

export const authRouter = express.Router();

authRouter.post("/user/signup", signUp);
authRouter.post("/user/login", login);
authRouter.post("/user/logout", logout);
authRouter.put("/user/update-profile", userAuth, updateProfile);

authRouter.get("/user/checkauth", userAuth, checkAuth);
