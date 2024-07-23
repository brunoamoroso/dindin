import express from 'express';
import { getAccounts } from '../controllers/accounts-controller';

const accountsRoutes = express.Router();

accountsRoutes.get('/list', getAccounts);

export default accountsRoutes;