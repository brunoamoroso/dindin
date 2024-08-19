import express from 'express';
import { addTransaction, getAllTransactionByMonth } from '../controllers/transactions-controller';
import { checkToken } from '../utils/check-token';

const transactionRoutes = express.Router();

transactionRoutes.get('/dashboard', checkToken, getAllTransactionByMonth);
transactionRoutes.post('/add', checkToken, addTransaction);

export default transactionRoutes;