import pool from "../../db/conn.js";

const getSupplier = async (req, res) => {
  try {
    const userId = req.userId;

    const [result] = await pool.query(
      `SELECT customers.*, 
              COALESCE(SUM(CASE 
                      WHEN transactions.transactionType = 'debit' THEN -transactions.amount  
                      WHEN transactions.transactionType = 'credit' THEN transactions.amount  
                      ELSE 0 
                  END), 0) AS final_balance
        FROM customers 
        LEFT JOIN transactions ON customers.id = transactions.CSId AND transactions.userId = ?
        WHERE customers.userId = ? AND customers.customerType = 'supplier'
        GROUP BY customers.id
        ORDER BY customers.id DESC`,
      [userId, userId]
    );

    if (result.length === 0) {
      return res.status(404).json({ success: false, message: "No data found" });
    }

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default getSupplier;
