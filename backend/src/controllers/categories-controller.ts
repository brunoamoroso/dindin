import { Request, Response } from "express";
import clientDB from "../db/conn";

export const getCategories = async (req: Request, res:Response) => {
    const {type} = req.params;

    try{
        const gainCategories = await clientDB.query(`
            select Category {
                desc,
                type
            } filter .type = <default::CategoryType>$type`,
            {
                type: type
            }).catch((err) => {
                res.status(422);
                throw new Error(err);
            });

        return res.status(200).send({status: 200, message: gainCategories});
    }catch(err: unknown){
        console.log(err);
        return res.status(422).send({status: 404, message: "Não conseguimos encontrar nenhuma categoria nesse momento."});
    }
}