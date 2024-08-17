import { Request, Response } from "express";
import clientDB from "../db/conn";
import e from '../db/dbschema/edgeql-js';
import { User } from "../db/dbschema/edgeql-js/modules/default";

export const getCategories = async (req: Request, res:Response) => {
    const {type} = req.params;

    if(req.user === undefined){
        throw new Error("User Unauthenticated");
    }

    try{
        const categories = e.select(e.Category, (category) => {

            const userLink = e.select(e.User, (user) => ({
                id: true,
                filter: e.op(user.id, "=", e.uuid(req.user as string))
            }))

            const createdByUser = e.op(category.created_by.id, "=", userLink.id);
            const createdBySystem = e.op(category.is_public, "=", true);
            const filterType = e.op(category.type, "=", e.cast(e.CategoryType, type));

            return{
                id: true,
                desc: true,
                filter: e.op(
                    filterType,
                    "and", 
                    e.op(createdBySystem, 'or', createdByUser))
            }
        });

        const categoriesResult = await categories.run(clientDB);

        return res.status(200).send(categoriesResult);
    }catch(err: unknown){
        console.log(err);
        return res.status(422).send("Não conseguimos encontrar nenhuma categoria nesse momento.");
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
            return res.status(204).send("Essa categoria não possuí nenhuma sub categoria ainda")
        }

        return res.status(200).send(subCategories);
    }catch(err: unknown){
        console.log(err);
        return res.status(422).send({status: 404, message: "Não conseguimos encontrar nenhuma categoria nesse momento."});
    }
}