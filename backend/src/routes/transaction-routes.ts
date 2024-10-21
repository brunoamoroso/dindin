import express from 'express';
import { addTransaction, deleteTransaction, getAllTransactionsByMonth, getOneTransaction } from '../controllers/transactions-controller';
import { checkToken } from '../utils/check-token';

const transactionRoutes = express.Router();

transactionRoutes.get('/all-month/:selectedDate', checkToken, getAllTransactionsByMonth);
transactionRoutes.get('/:id', checkToken, getOneTransaction);
transactionRoutes.post('/add', checkToken, addTransaction);
transactionRoutes.delete('/delete/:id', checkToken, deleteTransaction);

export default transactionRoutes;