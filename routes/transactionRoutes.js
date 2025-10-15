import express from "express";
import { addTransaction, getAllTransaction,editTransaction,deleteTransaction} from "../controllers/transactionCtrl.js";

const router = express.Router();

router.post('/add-transaction',addTransaction);
router.post('/get-transaction',getAllTransaction);
router.post('/edit-transaction',editTransaction);
router.post('/delete-transaction',deleteTransaction);

export default router;  // ✅ required for ESM
