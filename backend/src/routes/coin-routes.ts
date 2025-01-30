import express from 'express';
import { addNewUserSelectedCoin, getCoins, getUserSelectedCoins, setDefaultUserCoin } from '../controllers/coin-controllers';
import { checkToken } from '../utils/check-token';

const coinRoutes = express.Router();

coinRoutes.get('/user-coins-selection', checkToken, getUserSelectedCoins);
coinRoutes.get('/get-coins', checkToken, getCoins);
coinRoutes.put('/user-coins/add', checkToken, addNewUserSelectedCoin, setDefaultUserCoin);



export default coinRoutes;