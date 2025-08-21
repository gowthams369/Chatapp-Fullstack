import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  console.log("App is running");
});

app.listen(port, () => {
  console.log("App is runnig on port...");
});
