import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import router from "./routes/user.routes.js";
import { verifyJWT } from "./middlewares/auth.middleware.js";
import { logoutUser } from "./controllers/user.controller.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v1", router);
// app.post("/user/logout", verifyJWT, logoutUser);

export default app;
