import { Request, Response } from "express";
import { db } from "../db/conn";

export const getAccounts = async (req: Request, res: Response) => {
    const user = req.user;
    try{
        const queryAccounts = `SELECT * FROM accounts WHERE created_by = $1`;
        
        const valuesAccounts = [user];

        const {rows: accounts} = await db.query(queryAccounts, valuesAccounts);

        return res.status(200).send(accounts);

    }catch(err){
        throw new Error(err as string);
    }
}