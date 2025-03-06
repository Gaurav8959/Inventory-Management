import { sendVerification } from "../../middleware/email.js"
import bcrypt from "bcryptjs"
import pool from "../../db/conn.js";

const register = async (req, res) => {
  try {
    //Getting the user from the request
    const { name, email, mobile, userpassword, businessName } = req.body;
    if (!name ||!email || !mobile || !userpassword || !businessName) {
      return res
        .status(400)
        .json({ success: false, message: "All field are require" });
    }
    //Checking the user if already exist
    const [existUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existUser.length > 0) {
      return res
        .status(409)
        .json({ success: false, message: "User Already Exist" });
    }
    // Generate OTP
    const generateotp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
    const expireOtp = new Date(Date.now() + 5 * 60 * 1000).toISOString();


    //Hash Password
    const hashedPassword = await bcrypt.hash(userpassword, 12);

    //Storing image in the cloudinary if provided


    const [result] = await pool.query(
        'INSERT INTO users (name, email, mobile, userpassword, businessName, otp, otpExpires) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [name,email,mobile,hashedPassword,businessName,generateotp,expireOtp]
    );
    
    await sendVerification(email, generateotp);
    return res.status(200).json({ success: true, message: "Otp send Successfully to your email", storeUser:{id:result.insertId, name, email, mobile, businessName}});
  } catch (error) {
    console.log("User creation error internal", error);
    res.status(500).json({ success: false, message: "Internal Server Error"});
  }
};

export default register;
