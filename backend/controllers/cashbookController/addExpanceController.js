import pool from "../../db/conn.js";

const addExpense = async (req, res) => {
  try {
    const { amount, transactionType, mode_of_payment, balance, description } = req.body;
    const userid = req.userId;
    console.log( amount, transactionType, mode_of_payment, balance, description)
    if (!userid || !amount || !transactionType || !mode_of_payment) {
      return res
        .status(400)
        .json({ success: false, message: "All filed are required" });
    }
    await pool.query(
      "INSERT INTO cashbook (userId, amount, transactionType, balance, mode_of_payment, description) VALUES (?, ?, ?, ?, ?, ?)",
      [userid, amount, transactionType, balance, mode_of_payment, description]
    );
    return res.status(200).json({ success:false, message: "Cash Added", result: {amount,userid,transactionType,balance,mode_of_payment,description}});
  } catch (error) {
    return res.status(500).json({ success:false, message: error.message});
  }
};

export default addExpense;
