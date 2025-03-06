import pool from "../../db/conn.js";

const Logout = async (req, res) => {
  try {
    // Delete the token from the users_tokens table
    await pool.query(
      "DELETE FROM users_tokens WHERE user_id = ? AND token = ?",
      [req.userId, req.token]
    );

    // Clear the authentication cookie
    res.clearCookie("token", {
      path: "/",
      httpOnly: true,
    });

    return res
      .status(200)
      .json({ success: true, message: "Logout Successfully" });
  } catch (error) {
    console.error("Logout Error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export default Logout;
