import pool from "../../db/conn.js";

const GetDebitedCustomer = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res
        .status(404)
        .json({ success: false, message: "User Id not found" });
    }

    const [result] = await pool.query(
      `SELECT 
    c.name AS person_name,
    t.id,
    t.type,
    t.collectionDate,
    c.email,
    c.profilePic,
    t.CSId,
    MAX(t.currentDate) AS latest_transaction_date,
    SUM(
        CASE 
            WHEN t.transactionType = 'credit' THEN -t.amount 
            WHEN t.transactionType = 'debit' THEN t.amount 
            ELSE 0 
        END
    ) AS pending_amount
FROM transactions t
INNER JOIN customers c ON c.id = t.CSId
WHERE t.userId = ?
GROUP BY c.name, t.type
HAVING pending_amount > 0
ORDER BY latest_transaction_date DESC;`,
      [userId]
    );

    if (result.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Data not found" });
    }

    return res.status(200).json({ success: true, result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default GetDebitedCustomer;
