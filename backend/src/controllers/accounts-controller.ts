import { Request, Response } from "express";
import clientDB from "../db/conn";


export const getAccounts = async (req: Request, res: Response) => {
    try{
        const accounts = await clientDB.query(`
                select Account{
                    id,
                    description,
                    bank
                }
            `);

        return res.status(200).send({status: 200, message: accounts});

    }catch(err){
        throw new Error(err as string);
    }
}