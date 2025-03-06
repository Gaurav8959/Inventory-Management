import express from "express";
import authenticate from "../middleware/authenticate.js";
import fileUpload from "../middleware/fileUpload.js";
import getSupplier from "../controllers/supplierController/getSupplierController.js";
import addSupplier from "../controllers/supplierController/addSupplierController.js";


const supplierRouter = express.Router();

supplierRouter.post("/add-supplier", authenticate, fileUpload.single('profilePic'), addSupplier);
supplierRouter.get("/get-supplier", authenticate, getSupplier);

export default supplierRouter;