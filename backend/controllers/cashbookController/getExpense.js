import pool from "../../db/conn.js";

const getExpense = async (req, res) => {
    const userId = req.userId;
    const { transactionDate, id } = req.query; // Extract id from query params

    try {
        let query = 'SELECT * FROM `cashbook` WHERE userId = ?';
        let values = [userId];

        if (id) {
            query += ' AND id = ?'; // Filter by id if provided
            values.push(id);
        } else if (transactionDate) {
            query += ' AND transactionDate = ?'; // Filter by transactionDate if provided
            values.push(transactionDate);
        }

        query += ' ORDER BY id DESC';

        const [result] = await pool.query(query, values);

        if (result.length === 0) {
            return res.status(404).json({ success: false, message: "No data found", result });
        }

        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

export default getExpense;
