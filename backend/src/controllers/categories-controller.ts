import { Request, Response } from "express";
import clientDB from "../db/conn";
import e from '../db/dbschema/edgeql-js';
import { subCategory, User } from "../db/dbschema/edgeql-js/modules/default";

export const getCategories = async (req: Request, res:Response) => {
    const {type} = req.params;

    try{
        const queryCategories = e.select(e.Category, (category) => {

            const createdByUser = e.op(category.created_by.id, "=", e.uuid(req.user as string));
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

        const categories = await queryCategories.run(clientDB);

        return res.status(200).send(categories);
    }catch(err: unknown){
        console.log(err);
        return res.status(422).send("Não conseguimos encontrar nenhuma categoria nesse momento.");
    }
}

export const getSubCategories = async (req: Request, res:Response) => {
    const {category} = req.params;

    try{
        const querySubcategories = e.select(e.Category, (cat) => {

            const createdByUser = e.op(cat.created_by.id, "=", e.uuid(req.user as string));
            const createdBySystem = e.op(cat.is_public, "=", true);

            return{
                subCategories: () => ({
                    id: true,
                    desc: true,
                    filter: e.op(createdBySystem, "or", createdByUser)
                }),
                filter: e.op(cat.desc, "=", category)
            }
        });
        
        const subCategories = await querySubcategories.run(clientDB);

        res.status(200).json(subCategories);
        return;


        // const query = await clientDB.query(`
        //     select Category {
        //         desc,
        //         subCategories: {
        //             id,
        //             desc
        //         }
        //     } filter .desc = <str>$category`,
        //     {
        //         category: category
        //     }).catch((err) => {
        //         res.status(422);
        //         throw new Error(err);
        //     });
            
        // const subCategories = query[0]!.subCategories;
        
        // if(subCategories.length === 0){
        //     return res.status(204).send("Essa categoria não possuí nenhuma sub categoria ainda")
        // }

        // return res.status(200).send(subCategories);
    }catch(err: unknown){
        console.log(err);
        return res.status(422).json({message: "Não conseguimos encontrar nenhuma categoria nesse momento."});
    }
}