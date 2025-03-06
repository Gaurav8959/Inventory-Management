import pool from "../../db/conn.js";

const deleteTransaction = async (req, res) => {
  try {
    const transactionId = req.params;

    // ✅ Validate transaction ID
    if (!transactionId.id) {
      return res.status(400).json({
        success: false,
        message: "Transaction ID is required",
      });
    }

    // ✅ Execute DELETE query and check affected rows
    const [result] = await pool.query(
      "DELETE FROM `transactions` WHERE id = ?",
      [transactionId.id]
    );

    // ✅ If no rows were affected, transaction does not exist
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    // ✅ Successfully deleted
    return res.status(200).json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default deleteTransaction;
