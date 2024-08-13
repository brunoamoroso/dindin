import express from 'express';
import { addTransaction } from '../controllers/transactions-controller';

const transactionRoutes = express.Router();

transactionRoutes.post('/add', addTransaction);

export default transactionRoutes;