import express from "express";
import emailForForgetpass from "../controllers/forgetpassController/forgetPassController.js";
import sendOtpforReset from "../controllers/forgetpassController/otpController.js";
import resetPassword from "../controllers/forgetpassController/changePassController.js";

const forgetpassRouter = express.Router();

forgetpassRouter.post("/emailforgetpass", emailForForgetpass);
forgetpassRouter.post("/reset-otp", sendOtpforReset);
forgetpassRouter.post("/reset-password", resetPassword);


export default forgetpassRouter;