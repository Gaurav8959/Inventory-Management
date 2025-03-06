import jwt from "jsonwebtoken";
import pool from "../db/conn.js"; // Assuming you're using a MySQL connection pool

const authenticate = async (req, res, next) => {
  try {
    // Extract the token from the Authorization header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized User: No token provided" });
    }

    // Verify the token
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, process.env.KEYSECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ success: false, message: "Session expired. Please log in again." });
      }
      return res.status(401).json({ success: false, message: "Invalid token. Please log in again." });
    }

    // Query to find the user in the database by decoded token ID
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [decodedToken.id]);
    if (rows.length === 0) {
      return res.status(403).json({ success: false, message: "Access denied. User not found." });
    }

    const rootUser = rows[0];
   

    // Check if the token is valid and exists for the user
    const [tokenRows] = await pool.query('SELECT * FROM users_tokens WHERE user_id = ? AND token = ?', [rootUser.id, token]);
    if (tokenRows.length === 0) {
      return res.status(403).json({ success: false, message: "Access denied. Invalid token." });
    }

    // Attach user data to request
    req.token = token;
    req.rootUser = rootUser;
    req.userId = rootUser.id;
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Authentication Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export default authenticate;
