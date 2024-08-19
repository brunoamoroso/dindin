import express from 'express';
import { addTransaction } from '../controllers/transactions-controller';
import { checkToken } from '../utils/check-token';

const transactionRoutes = express.Router();

transactionRoutes.post('/add', checkToken, addTransaction);

export default transactionRoutes;