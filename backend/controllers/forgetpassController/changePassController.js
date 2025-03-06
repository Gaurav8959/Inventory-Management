import pool from "../../db/conn.js";
import bcrypt from "bcryptjs"

const resetPassword = async (req, res) => {
  try {
    let { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "All fileds are required" });
    }
    const [userRow] = await pool.query('SELECT * FROM users WHERE email= ?',[email]);
    if (userRow === 0) {
      return res.status(400).json({ success: false, message: "Invalid User" });
    }

    const user = userRow[0];

    //Check if otp verification flag set
    if (user.isOtpVerifiedforReset === 0) {
      return res
        .status(403)
        .json({ success: false, message: "OTP verification is required" });
    }

    if (!newPassword) {
      console.log(newPassword)
      return res.status(400).json({ success: false, message: "New password is required" });
    }

    //Hash new password
    if (newPassword) {
      newPassword = await bcrypt.hash(newPassword.toString(), 12);
    }

    // Update the password
    // userExist.password = newPassword; // Ensure proper password hashing
    // userExist.isOtpVerifiedforReset = false; // Reset the flag after successful password reset
    await pool.query('UPDATE users SET userpassword=?, isOtpVerifiedforReset= ? WHERE email=?', [newPassword,false,email]);

    return res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.error("Error in ResetPassword:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your request",
    });
  }
};

export default resetPassword;
