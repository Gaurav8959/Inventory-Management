import pool from "../../db/conn.js";
import cloudinary from "../../config/cloudinary.js";

const EditSupplierTransaction = async (req, res) => {
  try {
    const transactionId = req.params;
    const { amount, paymentMethod, description, currentDate } = req.body;


    // ✅ Validate transaction ID
    if (!transactionId.id) {
      return res.status(400).json({
        success: false,
        message: "Transaction ID is required",
      });
    }

    // ✅ Check if transaction exists before updating
    const [existingTransaction] = await pool.query(
      "SELECT * FROM suppliertransaction WHERE id = ?",
      [transactionId.id]
    );
    

    if (existingTransaction.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    let newAttachment = existingTransaction.attachment;
    let attachmentPublicId = existingTransaction.attachmentPublicId;

     // Handle Attechment update (if new file is uploaded)
     if (req.file) {
      // Delete old profile photo from Cloudinary (if exists)
      if (existingTransaction.attachmentPublicId) {
        await cloudinary.uploader.destroy(existingTransaction.attachmentPublicId);
      }

      // Save new Cloudinary URL and public ID
      newAttachment = req.file.path; // Cloudinary URL
      attachmentPublicId = req.file.filename; // Cloudinary public ID
    }

    // ✅ Update transaction details
    const [updateResult] = await pool.query(
      `UPDATE suppliertransaction 
       SET amount = ?, paymentMethod = ?, 
           description = ?, currentDate = ?, attachment = ?, edited = ?, attachmentPublicId = ?
       WHERE id = ?`,
      [
        amount || existingTransaction[0].amount, // Keep existing values if not provided
        paymentMethod || existingTransaction[0].paymentMethod,
        description || existingTransaction[0].description,
        currentDate || existingTransaction[0].currentDate,
        newAttachment || existingTransaction[0].attachment,
        true, // Mark as edited
        attachmentPublicId || existingTransaction.attachmentPublicId,
        transactionId.id,
      ]
    );

    // ✅ Check if the update was successful
    if (updateResult.length === 0) {
      return res.status(500).json({
        success: false,
        message: "Failed to update transaction",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
    });
  } catch (error) {
    console.error("Error updating transaction:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export default EditSupplierTransaction;
