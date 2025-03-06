import pool from "../../db/conn.js";


const checkOtp = async (req, res) => {
   try {
    const {email, otp} = req.body;
    
    //Check if both email and otp provided
    if (!email || !otp ) {
        return res.status(400).json({ success: false, message: "Email and Otp are required"});
    }

    //find the user by email
    const [userRows] = await pool.query('SELECT * FROM users WHERE email= ?', [email]);
    if (userRows.length === 0) {
        return res.status(400).json({ success: false, message: "User not found with this email"});
    }

    const user = userRows[0]
    const storedOtpExpires = new Date(user.otpExpires + " UTC").getTime();
    const currentTime = Date.now();
    //Check if otp matches and is not expires
    if (currentTime > storedOtpExpires) {
        return res.status(400).json({ success: false, message: "OTP has expired"});
    }

    if (String(user.otp) !== String(otp)) {
        console.log("Stored OTP:", user.otp);
        console.log("Entered OTP:", otp);
        return res.status(400).json({ success: false, message: "Otp does not match" });
    }
    

    //Invalide the otp from the reuse and update user as verified
    await pool.query('UPDATE users SET otp=NULL, otpExpires=NULL, isVerified = ? WHERE email = ?', [true, email]);

    return res.status(200).json({ success: true, message: "OTP Verified Successfully"});
   } catch (error) {
    console.log("Error in OTP Check", error);
    return res.status(500).json({ success: false, message: "Internal Server error"});
   }
};

export default checkOtp;