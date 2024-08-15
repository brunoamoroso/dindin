import { Request, Response } from "express";
import clientDB from "../db/conn";
import e from '../db/dbschema/edgeql-js';

export const CreateProfile = async (req: Request, res:Response) => {
    const {name, surname, email, password, username} = req.body;
    let photo = req.file?.filename;

    if(photo === undefined){
        photo = "";
    }

    try{
        const insert = e.insert(e.User, {
            photo: e.str(photo),
            name: e.str(name),
            surname: e.str(surname),
            email: e.str(email),
            password: e.str(password),
            username: e.str(username),
        });

        const newUser = await insert.run(clientDB);
        // const newUser2 = await clientDB.execute(`
        //     insert User {
        //         photo := <str>$photo,
        //         name := <str>$name,
        //         surname := <str>$surname,
        //         email := <str>$email,
        //         password := <str>$password
        //     }`, {
        //         photo: photo,
        //         name: name,
        //         surname: surname,
        //         email: email,
        //         password: password
        //     }).catch((err) => {
        //         res.status(422);
        //         throw new Error(err);
        //     });
        console.log(newUser);
    }catch(err: unknown){
        if(err.message.includes("email")){
            return res.status(422).send({status: 422, message: "O email que você usou já está cadastrado."});
        }

        return res.status(422).send({status: 422, message: "Erro inesperado. Avise um administrador"});
    }

    return res.status(201).send({message: "user created"});
}