import express from 'express';
import { checkToken } from '../utils/check-token';
import { createLimit, deleteLimit, getLimits } from '../controllers/limit-controllers';

const limitRoutes = express.Router();

limitRoutes.post('/create', checkToken, createLimit);
limitRoutes.get('/:selectedDate/:coinSelected', checkToken, getLimits);
limitRoutes.delete('/delete/:id', checkToken, deleteLimit);
limitRoutes.put('/:id', checkToken, getLimits);

export default limitRoutes;