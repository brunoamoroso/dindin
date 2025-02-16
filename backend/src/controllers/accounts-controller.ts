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
        console.error(err);
        return res.status(422).send({message: "Can't create the account right now"});
    }
}

export const createAccount = async (req: Request, res: Response) => {
    const user = req.user;
    const {description} = req.body;

    try{
        const queryCreateAccount = `INSERT INTO accounts (description, created_by) VALUES ($1, $2) RETURNING *`;

        const valuesCreateAccount = [description, user];

        const {rows: account} = await db.query(queryCreateAccount, valuesCreateAccount);

        return res.status(201).send(account[0]);

    }catch(err){
        console.error(err);
        return res.status(500).send({message: "Can't create the account right now"});
    }
};