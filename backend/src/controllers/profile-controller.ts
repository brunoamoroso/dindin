import { query, Request, Response } from "express";
import clientDB from "../db/conn";
import e from '../db/dbschema/edgeql-js';
import { createUserToken } from "../utils/create-user-token";
import bcrypt from 'bcrypt';

export const CreateProfile = async (req: Request, res:Response) => {
    const {name, surname, email, password, username} = req.body;
    let photo = req.file?.filename;

    if(photo === undefined){
        photo = "";
    }

    try{
        const queryEmail = e.select(e.User, () => ({
            email: true,
            filter_single: {
                email: e.str(email)
            }
        }));

        const emailExists = await queryEmail.run(clientDB);

        if(emailExists){
            return res.status(422).json({message: "O email que você utilizou já está cadastrado"});
        }

        const queryUsername = e.select(e.User, () => ({
            username: true,
            filter_single: {
                username: e.str(username)
            }
        }));

        const usernameExists = await queryUsername.run(clientDB);

        if(usernameExists){
            return res.status(422).json({message: "O nome de usuário já está em uso"})
        }


        const insert = e.insert(e.User, {
            photo: e.str(photo),
            name: e.str(name),
            surname: e.str(surname),
            email: e.str(email),
            password: e.str(password),
            username: e.str(username),
        });

        const newUser = await insert.run(clientDB);

        await createUserToken(newUser, req, res);

    }catch(err: unknown){
        if(err.message.includes("email")){
            return res.status(422).send({status: 422, message: "O email que você usou já está cadastrado."});
        }

        return res.status(422).send({status: 422, message: "Erro inesperado. Avise um administrador"});
    }
}