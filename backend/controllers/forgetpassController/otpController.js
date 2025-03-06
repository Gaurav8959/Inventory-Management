import pool from "../../db/conn.js";


const sendOtpforReset = async (req, res) => {
   try {
    const {email, otp} = req.body;
    console.log(email, otp)
    //Check if both email and otp provided
    if (!email || !otp ) {
        return res.status(400).json({ success: false, message: "Email and Otp are required"});
    }

    //find the user by email
    const [UserRow] = await pool.query('SELECT * FROM users WHERE email = ?',[email]);
    if (UserRow === 0) {
        return res.status(400).json({ success: false, message: "User not found with this email"});
    }

    const user = UserRow[0];

    const storedOtpExpires = new Date(user.otpExpires + " UTC").getTime();

    //Check if otp matches and is not expires
    if (Date.now() > storedOtpExpires) {
        return res.status(400).json({ success: false, message: "OTP has expired"});
    }

    if (String(user.otp) !== String(otp)) {
        return res.status(400).json({ success: false, message: "Otp does not match"});
    }

    //Invalide the otp from the reuse
    // registerUser.otp = null;
    // registerUser.otpExpires = null;
    // registerUser.isOtpVerifiedforReset = true;
    await pool.query('update users SET otp=NULL, otpExpires=NULL, isOtpVerifiedforReset=True  WHERE email= ?',[email]);

    return res.status(200).json({ success: true, message: "OTP Verified Successfully"});
   } catch (error) {
    console.log("Error in OTP Check", error);
    return res.status(500).json({ success: false, message: "Internal Server error"});
   }
};

export default sendOtpforReset;