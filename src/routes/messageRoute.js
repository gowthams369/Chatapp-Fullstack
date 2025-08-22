import express from "express";
import { userAuth } from "../middleware/authMiddleware.js";
import {
  getMessage,
  getUsers,
  sendMessage,
} from "../controller/mesageController.js";

export const messageRouter = express.Router();

messageRouter.get("/user/message", userAuth, getUsers);
messageRouter.get("/user/getmessage/:reciverId", userAuth, getMessage);
messageRouter.post("/user/sendmessage/:reciverId", userAuth, sendMessage);
