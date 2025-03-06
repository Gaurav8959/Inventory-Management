import express from "express";
import authenticate from "../middleware/authenticate.js";
import addTransaction from "../controllers/transactionController/addTransactionController.js";
import EditTransaction from "../controllers/transactionController/editTransactionController.js";
import DeleteTransaction from "../controllers/transactionController/deleteTransactionController.js";
import getTransation  from "../controllers/transactionController/getTransactionController.js";
import getParticularTransation from "../controllers/transactionController/getParticularTransaction.js";
import getSupplierTransation from "../controllers/transactionController/getSupplierTransaction.js";
import fileUpload from "../middleware/fileUpload.js";

const transactionRouter = express.Router();

transactionRouter.post("/add-transaction", authenticate, fileUpload.single('attachment'), addTransaction);
transactionRouter.put("/edit-transaction/:id", authenticate, fileUpload.single('attachment'), EditTransaction);
transactionRouter.delete("/delete-transaction/:id", authenticate, DeleteTransaction);
transactionRouter.get("/gettransaction/:id", getTransation);
transactionRouter.get("/getsuppliertransaction/:id", getSupplierTransation);
transactionRouter.get("/getparticulartransaction/:id",getParticularTransation);

export default transactionRouter;