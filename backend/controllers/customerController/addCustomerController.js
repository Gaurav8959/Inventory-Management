import pool from "../../db/conn.js";


const addCustomer = async (req, res) => {
  try {
    const {
      name,
      email,
      mobile,
      customerType,
      GSTIN,
      flatBuildingNo,
      areaLocality,
      pincode,
      city,
      state,
    } = req.body;
    const userId = req.userId;

    if (!userId) {
      return res
        .status(403)
        .json({ success: false, message: "Unauthorized access" });
    }

    let profilePic = null;
    let profilephotoPublicId = null;

    if (req.file) {
      profilePic = req.file.path; // Cloudinary URL
      profilephotoPublicId = req.file.filename; // Cloudinary public ID
    }

    // ✅ Check required fields
    if (!name || !email || !mobile || !customerType) {
      return res
        .status(400)
        .json({
          success: false,
          message: "All required fields must be filled",
        });
    }

    // ✅ Convert email to lowercase before checking
    const [userExist] = await pool.query(
      "SELECT * FROM customers WHERE LOWER(email) = LOWER(?)",
      [email]
    );

    if (userExist.length > 0) {
      return res
        .status(409)
        .json({ success: false, message: "Customer already exists" });
    }

    // ✅ Insert new customer into MySQL
    await pool.query(
      "INSERT INTO customers (name, email, mobile, customerType, GSTIN, profilePic, flatBuildingNo, areaLocality, pincode, city, state, userId, profilephotoPublicId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        name,
        email.toLowerCase(), // Ensure email is stored in lowercase
        mobile,
        customerType,
        GSTIN || null, // Avoid null errors
        profilePic || null,
        flatBuildingNo || null,
        areaLocality || null,
        pincode || null,
        city || null,
        state || null,
        userId,
        profilephotoPublicId,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Customer added successfully",
      customer: {
        name,
        email: email.toLowerCase(),
        mobile,
        customerType,
        GSTIN,
        profilePic,
        billingAddress: { flatBuildingNo, areaLocality, pincode, city, state },
      },
    });
  } catch (error) {
    console.error("Error while creating customer:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export default addCustomer;
