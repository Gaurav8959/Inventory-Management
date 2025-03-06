import express from "express";
import addCustomer from "../controllers/customerController/addCustomerController.js";
import authenticate from "../middleware/authenticate.js"
import getCustomer from "../controllers/customerController/getCustomerController.js";
import fileUpload from "../middleware/fileUpload.js"
import getSupplier from "../controllers/customerController/getSupplierController.js";


const customerRouter = express.Router();

customerRouter.post("/add-customer", authenticate, fileUpload.single('profilePic'), addCustomer);
customerRouter.get("/getcustomer", authenticate, getCustomer);
customerRouter.get("/getsupplier", authenticate, getSupplier);

export default customerRouter;