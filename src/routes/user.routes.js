import express, { Router } from "express";
import {
  loginUser,
  logoutUser,
  refreshToken,
  registerUser,
  updateAcountDetails,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();
const app = express();

router.route("/user/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/user/login").post(loginUser);
router.route("/user/logout").post(verifyJWT, logoutUser);
router.route("/user/refresh-token").post(refreshToken);
router.route("/test").post(verifyJWT, updateAcountDetails);
// router.route("/user/logout").post((req, res) => {
//   // Logic for logout
//   console.log("logged out");
//   res.status(200).json({ message: "Logged out successfully" });
// });

export default router;
