import pool from "../../db/conn.js"
import { sendVerification } from "../../middleware/email.js";

const emailForForgetpass = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }
    const [userRow] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (userRow.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const user = userRow[0];
    //Generates OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    const otpExpires = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // OTP valid for 5 minutes
    console.log(otp)
    console.log(otpExpires)
    await pool.query('UPDATE users SET otp= ?, otpExpires=? WHERE id= ?',[otp, otpExpires, user.id]);

    // Send OTP to the user's email (using a mailer library like Nodemailer)
    sendVerification(user.email, otp);

    return res.status(200).json({
      success: true,
      message: "OTP sent to your email",
    });
  } catch (error) {
    console.error("Error in EmailForForgetPassword:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your request",
    });
  }
};

export default emailForForgetpass;
