import { Request, Response } from "express";
import clientDB from "../db/conn";

export const getCategories = async (req: Request, res:Response) => {
    const {type} = req.params;

    try{
        const categories = await clientDB.query(`
            select Category {
                id,
                desc
            } filter .type = <default::CategoryType>$type`,
            {
                type: type
            }).catch((err) => {
                res.status(422);
                throw new Error(err);
            });

        return res.status(200).send({status: 200, message: categories});
    }catch(err: unknown){
        console.log(err);
        return res.status(422).send({status: 404, message: "Não conseguimos encontrar nenhuma categoria nesse momento."});
    }
}

export const getSubCategories = async (req: Request, res:Response) => {
    const {category} = req.params;

    try{
        const query = await clientDB.query(`
            select Category {
                desc,
                subCategories: {
                    id,
                    desc
                }
            } filter .desc = <str>$category`,
            {
                category: category
            }).catch((err) => {
                res.status(422);
                throw new Error(err);
            });
            
        const subCategories = query[0]!.subCategories;
        
        if(subCategories.length === 0){
            return res.status(200).send({status: 204, message: "Essa categoria não possuí nenhuma sub categoria ainda"})
        }

        return res.status(200).send({status: 200, message: subCategories});
    }catch(err: unknown){
        console.log(err);
        return res.status(422).send({status: 404, message: "Não conseguimos encontrar nenhuma categoria nesse momento."});
    }
}