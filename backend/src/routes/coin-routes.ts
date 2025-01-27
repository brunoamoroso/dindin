import express from 'express';
import { getUserSelectedCoins } from '../controllers/coin-controllers';
import { checkToken } from '../utils/check-token';

const coinRoutes = express.Router();

coinRoutes.get('/user-coins-selection', checkToken, getUserSelectedCoins);

export default coinRoutes;