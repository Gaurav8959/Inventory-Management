import pool from "../../db/conn.js";

const getSupplier = async (req, res) => {
  try {
    const userId = req.userId;

    const [result] = await pool.query(
      `SELECT supplier.*, 
              COALESCE(SUM(CASE 
                      WHEN suppliertransaction.transactionType = 'debit' THEN -suppliertransaction.amount  
                      WHEN suppliertransaction.transactionType = 'credit' THEN suppliertransaction.amount  
                      ELSE 0 
                  END), 0) AS final_balance
        FROM supplier 
        LEFT JOIN suppliertransaction ON supplier.id = suppliertransaction.supplierId AND suppliertransaction.userId = ?
        WHERE supplier.userId = ?
        GROUP BY supplier.id
        ORDER BY supplier.id DESC`,
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
