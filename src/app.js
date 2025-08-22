import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { authRouter } from "./routes/authRoute.js";

const app = express();
dotenv.config();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api", authRouter);

app.get("/", (req, res) => {
  console.log("App is running");
});

app.listen(port, () => {
  console.log("App is runnig on port...");
});
