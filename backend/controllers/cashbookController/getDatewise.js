import pool from "../../db/conn.js";

const getDateWise = async (req, res) => {
  const userId = req.userId;
  try {
    const [result] = await pool.query(
      `SELECT 
          t.transactionDate,
          t.id,
          -- Daily balance (debit - credit for each date)
          SUM(CASE 
              WHEN t.transactionType = 'debit' THEN -t.amount  
              WHEN t.transactionType = 'credit' THEN t.amount  
              ELSE 0 
          END) AS daily_balance,

          -- Cash in hand (total debit - credit from start of month till today)
          (SELECT COALESCE(SUM(
              CASE 
                  WHEN transactionType = 'debit' THEN -amount  
                  WHEN transactionType = 'credit' THEN amount  
                  ELSE 0 
              END), 0) 
          FROM cashbook 
          WHERE userId = ? 
          AND transactionDate <= t.transactionDate
          ) AS cash_in_hand

      FROM cashbook t
      WHERE t.userId = ? 
      AND t.transactionDate BETWEEN DATE_FORMAT(NOW(), '%Y-%m-01') AND NOW()
      GROUP BY t.transactionDate
      ORDER BY t.transactionDate DESC;`,
      [userId, userId]
    );

    if (result.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No data found", result });
    }
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export default getDateWise;
