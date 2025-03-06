import pool from "../../db/conn.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All filed are required" });
    }
    const [userRows] = await pool.query('SELECT * FROM users WHERE email= ?',[email]);
    if (userRows.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const user = userRows[0];

    const isMatch = await bcrypt.compare(password.toString(), user.userpassword);
    console.log("Password Match Result:", isMatch);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email or password" });
    }

    //Check is user is verified or not
    if (!user.isVerified) {
        return res.status(409).json({ success: false, message: "Please verifed your email Profile first"});
    }
   

    //Generates token
    const token = await jwt.sign({ id: user.id, email: user.email}, process.env.KEYSECRET,{
        expiresIn: "1d",
    });

    //Store token in 'User_tokens' table
    await pool.query('INSERT INTO users_tokens (user_id, token) VALUES ( ?, ?)',[user.id, token]);


    //Cookie generates
    res.cookie("token", token, {
      expires: new Date(Date.now() + 9000000),
      httpOnly: true,
    });
    
    return res
      .status(200)
      .json({
        success: true,
        message: "Login Successfully",
        token,
        user : {
            id: user.id,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            businessName: user.businessName,
        },
      });
  } catch (error) {
    console.log("Login error internal", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export default login;
