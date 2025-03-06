import pool from "../../db/conn.js";

const setCollectionDate = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    const { transactionId, collectionDate } = req.body;
    const userId = req.userId;
    
    console.log(transactionId, collectionDate, userId);

    // ✅ Validate required fields
    if (!userId || !transactionId || !collectionDate) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // ✅ Start transaction
    await connection.beginTransaction();

    // ✅ Update collectionDate in transactions table
    const [result] = await connection.query(
      "UPDATE transactions SET collectionDate = ? WHERE CSId = ? AND userId = ?",
      [collectionDate, transactionId, userId]
    );

    if (result.affectedRows === 0) {
      throw new Error("Transaction not found or user unauthorized");
    }

    // ✅ Commit transaction if successful
    await connection.commit();
    return res.status(200).json({ success: true, message: "Collection Date Updated Successfully" });

  } catch (error) {
    await connection.rollback(); // Rollback on error
    return res.status(500).json({ success: false, message: error.message });
  } finally {
    connection.release(); // ✅ Release connection back to the pool
  }
};

export default setCollectionDate;
