import express from 'express';
import { getAccounts } from '../controllers/accounts-controller';
import { checkToken } from '../utils/check-token';

const accountsRoutes = express.Router();

accountsRoutes.get('/list', checkToken, getAccounts);

export default accountsRoutes;