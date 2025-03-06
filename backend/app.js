import express from "express";
import cors from "cors";
import authRouter from "./routes/authRouter.js";
import forgetpassRouter from "./routes/forgetpassRouter.js";
import customerRouter from "./routes/customerRouter.js";
import transactionRouter from "./routes/transactionRouter.js";
import cashBookRouter from "./routes/cashbookRouter.js";
import supplierRouter from "./routes/supplierRouter.js";
import supplierTransactionRouter from "./routes/supplierTransactionRouter.js";
import path from 'path';
import { fileURLToPath } from "url";
import collectionRouter from "./routes/collectionRouter.js";
import './controllers/collectionController/markMail.js'


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(
  cors()
);

//app route for authentication
app.use("/api", authRouter);

//app route for forget Password
app.use("/api", forgetpassRouter);

// //app router for customer
app.use("/api", customerRouter);

// //app route for transaction
app.use("/api", transactionRouter);

//app router for cashbook
app.use("/api", cashBookRouter);


//app Router for collection
app.use("/api", collectionRouter);

//app Router for Supplier
app.use("/api", supplierRouter);

//app Router for Supplier
app.use("/api", supplierTransactionRouter);

app.use((express.static(path.join(__dirname,"../client/dist"))))
app.get("*",function(req,res){
  res.sendFile(path.join(__dirname,"../client/dist/index.html"))
});
// Server Listen
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port No: ${process.env.PORT}`);
});
