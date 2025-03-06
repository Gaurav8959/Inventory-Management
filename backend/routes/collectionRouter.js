import express from "express";
import GetDebitedCustomer from "../controllers/collectionController/getCollectionController.js";
import authenticate from "../middleware/authenticate.js";
import setCollectionDate from "../controllers/collectionController/setCollectionDate.js";
import allPendingCustomer from "../controllers/collectionController/allPendingCollection.js";
import { sendReminderEmail } from "../controllers/collectionController/sendRemainderEmail.js";

const collectionRouter = express.Router();

collectionRouter.get('/collectionamnt', authenticate, GetDebitedCustomer);
collectionRouter.get('/allpendingcollection', authenticate, allPendingCustomer);
collectionRouter.post('/setcollectiondate', authenticate, setCollectionDate);
collectionRouter.post('/sendremaindermail', sendReminderEmail);

export default collectionRouter;