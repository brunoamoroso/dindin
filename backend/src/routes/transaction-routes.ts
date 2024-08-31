import express from 'express';
import { addTransaction, getAllTransactionsByMonth } from '../controllers/transactions-controller';
import { checkToken } from '../utils/check-token';

const transactionRoutes = express.Router();

transactionRoutes.get('/all-month/:selectedDate', checkToken, getAllTransactionsByMonth);
transactionRoutes.post('/add', checkToken, addTransaction);

export default transactionRoutes;