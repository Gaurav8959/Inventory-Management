import express from "express";
import addExpense from "../controllers/cashbookController/addExpanceController.js";
import authenticate from "../middleware/authenticate.js";
import editExpense from "../controllers/cashbookController/editExpenseController.js";
import deleteExpense from "../controllers/cashbookController/deleteExpense.js";
import getExpense from "../controllers/cashbookController/getExpense.js";
import getDateWise from "../controllers/cashbookController/getDatewise.js";

const cashBookRouter = express.Router();


cashBookRouter.post("/cashbook", authenticate, addExpense);
cashBookRouter.put("/editexpense/:id", authenticate, editExpense);
cashBookRouter.delete("/deleteexpense/:id", authenticate, deleteExpense);
cashBookRouter.get("/getexpense", authenticate, getExpense);
cashBookRouter.get("/getdatewise", authenticate, getDateWise);

export default cashBookRouter