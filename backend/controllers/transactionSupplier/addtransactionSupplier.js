import pool from "../../db/conn.js";

const addTransactionSupplier = async (req, res) => {
  try {
    const {
      supplierId,
      amount,
      transactionType,
      paymentMethod,
      description,
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
      !supplierId ||
      !amount ||
      !transactionType ||
      !paymentMethod ||
      !userId
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fileds are required" });
    }
    await pool.query(
      "iNSERT INTO suppliertransaction (userId,supplierId,amount,transactionType,paymentMethod,description,attachment,edited,attachmentPublicId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        userId,
        supplierId,
        amount,
        transactionType,
        paymentMethod,
        description,
        attachment,
        false,
        attachmentPublicId,
      ]
    );
    return res.status(200).json({
      success: true,
      message: "Transaction Saved",
      customer: {
        supplierId,
        amount,
        transactionType,
        paymentMethod,
        description,
        attachment,
        edited,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export default addTransactionSupplier;
