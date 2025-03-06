import pool from "../../db/conn.js";

const getSupplierTransation = async (req, res) => {
  try {
    const {id} = req.params;
    const [result] = await pool.query(
      `
            SELECT 
                t.currentDate,
                t.amount,
                t.id,
                t.transactionType,
                t.paymentMethod,
                t.attachment,
                t.description,
                (SELECT SUM(CASE 
                    WHEN transactionType = 'debit' THEN -amount  
                    WHEN transactionType = 'credit' THEN amount  
                    ELSE 0 
                END) 
                FROM suppliertransaction 
                WHERE supplierId = ?) AS final_balance
            FROM suppliertransaction t
            WHERE t.supplierId = ? ORDER BY t.currentDate DESC;
        `,
      [id, id]
    );

    if (result.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Data not found" });
    }

    return res.status(200).json({ success: true, result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default getSupplierTransation;
