import pool from "../../db/conn.js";

const deleteExpense = async (req, res) => {
  try {
    const expenseId = req.params;
    if (!expenseId) {
      return res
        .status(404)
        .json({ succss: false, message: "Expense Id is required" });
    }

    const [result] = await pool.query("DELETE FROM `cashbook` WHERE id=?", [
      expenseId.id,
    ]);

    if (result.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Transaction not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Delted Successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default deleteExpense;