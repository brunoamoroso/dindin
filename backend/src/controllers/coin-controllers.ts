import { NextFunction, Request, Response } from "express";
import e from "../db/dbschema/edgeql-js";
import clientDB from "../db/conn";

export const getUserSelectedCoins = async (req: Request, res: Response) => {
    const user = req.user;

    try {
        const userCoins = await e.select(e.Coin, (c) => ({
            img: true,
            desc: true,
            code: true,
            filter: e.op(c["<selectedCoins[is User]"].id, "=", e.uuid(user)),
            order_by:{
                expression: c.code,
                direction: e.ASC,
            }
        })).run(clientDB);

        res.status(200).json(userCoins);
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
        const coins = await e.select(e.Coin, (c) => ({
            id: true,
            img: true,
            desc: true,
            code: true,
            userHas: e.count(e.select(e.User, (selectUser) => ({
                filter_single: e.op(
                            e.op(selectUser.id, "=", e.uuid(user)),
                            "and",
                            e.op(selectUser.selectedCoins.id, "=", c.id)
                        )
            }))),
            order_by: {
                expression: c.code,
                direction: e.ASC,
            }
        })).run(clientDB);

        coins.sort((a,b) => b.userHas - a.userHas);

        res.status(200).json(coins);

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
        await e.update(e.User, (u) => ({
            set: {
                selectedCoins: {"+=" : e.select(e.Coin, (c) => ({
                    filter_single: e.op(c.id, "=", e.uuid(coinId))
                }))}
            },
            filter_single: e.op(u.id, "=", e.uuid(user))
        })).run(clientDB);

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
        const mutateSetDefaultUserCoin = await e.update(e.User, (u) => ({
            set: {
                user_default_coin: e.select(e.Coin, (c) => ({
                    filter_single: e.op(c.id, "=", e.uuid(coinId))
                }))
            },
            filter_single: e.op(u.id, "=", e.uuid(user)),
        })).run(clientDB);

        return res.status(200).json(mutateSetDefaultUserCoin);
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Internal server error"});
    }
}
