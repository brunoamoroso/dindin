import express from 'express';
import { checkToken } from '../utils/check-token';
import { createLimit, getLimits } from '../controllers/limit-controllers';

const limitRoutes = express.Router();

limitRoutes.post('/create', checkToken, createLimit);
limitRoutes.get('/:selectedDate/:coinSelected', checkToken, getLimits);

export default limitRoutes;