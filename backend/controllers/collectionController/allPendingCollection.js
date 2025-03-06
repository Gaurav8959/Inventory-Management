import pool from "../../db/conn.js";

const allPendingCustomer = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res
        .status(404)
        .json({ success: false, message: "User Id not found" });
    }

    const [result] = await pool.query(
      `SELECT  
    pc.*,  -- Select all columns from pendingcollection
    COALESCE(c.name, s.name) AS person_name  -- Get the correct name from either customers or suppliers
FROM pendingcollection pc
LEFT JOIN transactions t ON pc.transactionId = t.id AND pc.type = 'customer' 
LEFT JOIN customers c ON c.id = t.customerId
LEFT JOIN suppliertransaction st ON pc.transactionId = st.id AND pc.type = 'supplier'
LEFT JOIN supplier s ON s.id = st.supplierId
WHERE pc.userId = ?;
`,[userId] );

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

export default allPendingCustomer;
