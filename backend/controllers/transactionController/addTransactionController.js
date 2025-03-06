import pool from "../../db/conn.js";

const addTransaction = async (req, res) => {
  try {
    const {
      CSId,
      amount,
      transactionType,
      paymentMethod,
      description,
      balance,
      type,
      edited,
    } = req.body;
    const userId = req.userId;

    let attachment = null;
    let attachmentPublicId = null;

    if (req.file) {
      attachment = req.file.path; // Cloudinary URL
      attachmentPublicId = req.file.filename; // Cloudinary public ID
    }

    if (
      !CSId ||
      !amount ||
      !transactionType ||
      !paymentMethod ||
      !balance ||
      !type ||
      !userId
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fileds are required" });
    }
    await pool.query(
      "iNSERT INTO transactions (userId,CSId,amount,transactionType,paymentMethod,description,attachment,balance,edited,attachmentPublicId,type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        userId,
        CSId,
        amount,
        transactionType,
        paymentMethod,
        description,
        attachment,
        balance,
        false,
        attachmentPublicId,
        type
      ]
    );
    return res.status(200).json({
      success: true,
      message: "Transaction Saved",
      customer: {
        CSId,
        amount,
        transactionType,
        paymentMethod,
        description,
        attachment,
        balance,
        edited,
        type,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default addTransaction;
