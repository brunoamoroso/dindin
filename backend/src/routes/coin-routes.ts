import express from 'express';
import { addNewUserSelectedCoin, getCoins, getDefaultUserCoin, getUserSelectedCoins, setDefaultUserCoin } from '../controllers/coin-controllers';
import { checkToken } from '../utils/check-token';

const coinRoutes = express.Router();

coinRoutes.get('/user/selection', checkToken, getUserSelectedCoins);
coinRoutes.get('/get-coins', checkToken, getCoins);
coinRoutes.get('/user/get-default', checkToken, getDefaultUserCoin);

coinRoutes.put('/user/add', checkToken, addNewUserSelectedCoin, setDefaultUserCoin);
coinRoutes.put('/user/set-default', checkToken, setDefaultUserCoin);



export default coinRoutes;