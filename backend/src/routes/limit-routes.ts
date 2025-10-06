import express from 'express';
import { checkToken } from '../utils/check-token';
import { copyPreviousLimits, createLimit, deleteLimit, getLimitById, getLimits, updateLimit } from '../controllers/limit-controllers';

const limitRoutes = express.Router();

limitRoutes.post('/create', checkToken, createLimit);
limitRoutes.post('/copy-previous', checkToken, copyPreviousLimits);
limitRoutes.get('/:selectedDate/:coinSelected', checkToken, getLimits);
limitRoutes.get('/:id', checkToken, getLimitById);
limitRoutes.delete('/delete/:id', checkToken, deleteLimit);
limitRoutes.put('/update/:id', checkToken, updateLimit);

export default limitRoutes;