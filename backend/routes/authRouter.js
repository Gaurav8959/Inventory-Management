import express from "express";
import authenticate from "../middleware/authenticate.js";
import register from "../controllers/authController/registerController.js";
import checkOtp from "../controllers/authController/otpController.js";
import login from "../controllers/authController/loginController.js";
import Logout from "../controllers/authController/logout.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/otpverify", checkOtp);
authRouter.post("/login", login);
authRouter.get("/logout",authenticate, Logout);

export default authRouter;

