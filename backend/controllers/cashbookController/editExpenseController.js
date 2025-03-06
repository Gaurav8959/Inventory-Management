import pool from "../../db/conn.js";

const editExpense = async (req, res) => {
  try {
    const expenseId = req.params;
    const { amount, mode_of_payment, description } = req.body;

    if (!expenseId) {
      return res
        .status(400)
        .json({ success: false, message: "Expense id is required" });
    }

    //Check is expense exists or not
    const [existExpense] = await pool.query(
      "SELECT * FROM `cashbook` WHERE id=?",
      [expenseId.id]
    );

    if (existExpense.lastIndexOf === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Transaction not found" });
    }

    //Update transaction details
    const [updateTransaction] = await pool.query(
      "UPDATE `cashbook` SET amount=?, mode_of_payment=?, description=? WHERE id=?",
      [amount, mode_of_payment, description, expenseId.id]
    );

    //Check if update successfull or not
    if (updateTransaction.length === 0) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to update Transaction" });
    }

    return res
      .status(201)
      .json({ success: true, message: "Transaction edited" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export default editExpense;