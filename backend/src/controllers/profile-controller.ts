import { Request, Response } from "express";
import clientDB from "../db/conn";

export const CreateProfile = async (req: Request, res:Response) => {
    const {name, surname, email, password} = req.body;
    let photo = req.file?.filename;

    if(photo === undefined){
        photo = "";
    }

    try{
        await clientDB.execute(`
            insert User {
                photo := <str>$photo,
                name := <str>$name,
                surname := <str>$surname,
                email := <str>$email,
                password := <str>$password
            }`, {
                photo: photo,
                name: name,
                surname: surname,
                email: email,
                password: password
            }).catch((err) => {
                res.status(422);
                throw new Error(err);
            });
    }catch(err){
        throw new Error(err as string);
    }

    return res.status(201).send({status: 201, message: "user created"});
}