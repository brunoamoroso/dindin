import { NextFunction, Request, Response } from "express";
import { db } from "../db/conn";
import { getCoinCoversURL } from "../utils/get-coin-covers";

export const getUserSelectedCoins = async (req: Request, res: Response) => {
    const user = req.user;

    try {
        const queryUserSelectedCoins = `SELECT c.*
        FROM coins c
        JOIN user_selected_coins uc ON c.id = uc.coin_id
        WHERE uc.user_id = $1
        `;

        const valuesUserSelectedCoins = [user];

        const {rows: userCoins} = await db.query(queryUserSelectedCoins, valuesUserSelectedCoins);

        
        const userCoinsWithImages = await Promise.all(userCoins.map(async (coin: any) => {
            coin.img = await getCoinCoversURL(coin.img);
            return coin;
        }));
        
        res.status(200).json(userCoinsWithImages);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}

/**
 * Retrieve all coins and signs which user has already selected
 * @param req 
 * @param res 
 */
export const getCoins = async (req: Request, res: Response) =>  {
    const user = req.user;
    try{
        const queryGetCoins = `SELECT c.*, EXISTS (SELECT * FROM user_selected_coins uc WHERE uc.coin_id = c.id AND user_id = $1) AS userHas
        FROM coins c
        ORDER BY userHas DESC
        `;

        const valuesGetCoins = [user];

        const {rows: coins} = await db.query(queryGetCoins, valuesGetCoins);

        const coinsWithImages = await Promise.all(coins.map(async (coin: any) => {
            coin.img = await getCoinCoversURL(coin.img);
            return coin;
        }));

        res.status(200).json(coinsWithImages);

    }catch(err){
        console.log(err);
        res.status(500).json({message: "Internal server error"});
    }
}

export const addNewUserSelectedCoin = async (req: Request, res: Response, next: NextFunction) => {
    const user =  req.user;
    const { coinId } = req.body;
    
    if(coinId === undefined || coinId === ""){
        throw new Error("CoinId is required");
    }

    try{
        const queryAddNewUserSelectedCoin = `INSERT INTO user_selected_coins (user_id, coin_id) VALUES ($1, $2)`;

        const valuesAddNewUserSelectedCoin = [user, coinId];

        await db.query(queryAddNewUserSelectedCoin, valuesAddNewUserSelectedCoin);

        next();
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Problem with adding new coin to the user"});
    }
}

export const setDefaultUserCoin = async (req: Request, res: Response) => {
    const user = req.user;
    const {coinId} = req.body;

    try{
        const querySetDefaultUserCoin = `UPDATE users
        SET user_default_coin = (SELECT id FROM coins WHERE id = $1)
        WHERE users.id = $2`;

        const valuesSetDefaultUserCoin = [coinId, user];

        const {rows: mutateSetDefaultUserCoin} = await db.query(querySetDefaultUserCoin, valuesSetDefaultUserCoin);

        return res.status(200).json(mutateSetDefaultUserCoin);
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Internal server error"});
    }
}

export const getDefaultUserCoin = async (req: Request, res: Response) => {
    const user = req.user;

    try{
        const queryUserDefaultCoin = `SELECT coins.*
        FROM coins
        JOIN users ON coins.id = users.user_default_coin
        WHERE users.id = $1`;

        const values = [user];
        
        const {rows: userDefaultCoin} = await db.query(queryUserDefaultCoin, values);
        
        const coinCover = await getCoinCoversURL(userDefaultCoin[0].img);

        userDefaultCoin[0].img = coinCover;

        res.status(200).json(userDefaultCoin[0]);
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Internal server error"});
    }
}
