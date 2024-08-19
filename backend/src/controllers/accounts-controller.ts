import { Request, Response } from "express";
import clientDB from "../db/conn";
import e from '../db/dbschema/edgeql-js';

export const getAccounts = async (req: Request, res: Response) => {
    try{
        const queryAccounts = e.select(e.Account, (account) => {
            return{
                id: true,
                description: true,
                bank: true,
                filter: e.op(account.created_by.id, "=", e.uuid(req.user as string))
            }
        });

        const accounts = await queryAccounts.run(clientDB);

        return res.status(200).send(accounts);

    }catch(err){
        throw new Error(err as string);
    }
}