import express from "express";
import authenticate from "../middleware/authenticate.js";
import fileUpload from "../middleware/fileUpload.js";
import addTransactionSupplier from "../controllers/transactionSupplier/addtransactionSupplier.js";
import getSupplierTransation from "../controllers/transactionSupplier/getSupplierTransaction.js.js";
import EditSupplierTransaction from "../controllers/transactionSupplier/editSupplierTransaction.js";
import deleteSupplierTransaction from "../controllers/transactionSupplier/deleteSupplierTransaction.js";
import getParticularSupTransation from "../controllers/transactionSupplier/getParticularTransaction.js";

const supplierTransactionRouter = express.Router();

supplierTransactionRouter.get("/get-suppliertransaction/:id", authenticate, getSupplierTransation);
supplierTransactionRouter.get("/get-perticular-transaction/:id", authenticate, getParticularSupTransation);
supplierTransactionRouter.delete("/delete-suppliertransaction/:id", authenticate, deleteSupplierTransaction);
supplierTransactionRouter.post("/add-supplierTransaction", authenticate, fileUpload.single('attachment'),addTransactionSupplier);
supplierTransactionRouter.put("/edit-suppliertransaction/:id", authenticate, fileUpload.single('attachment'),EditSupplierTransaction );

export default supplierTransactionRouter;