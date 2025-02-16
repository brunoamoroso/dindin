import express from 'express';
import { createAccount, getAccounts } from '../controllers/accounts-controller';
import { checkToken } from '../utils/check-token';

const accountsRoutes = express.Router();

accountsRoutes.get('/list', checkToken, getAccounts);
accountsRoutes.post('/create', checkToken, createAccount);

export default accountsRoutes;