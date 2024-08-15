import { Request, Response } from "express";
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

        //hash the password
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        const insert = e.insert(e.User, {
            photo: e.str(photo),
            name: e.str(name),
            surname: e.str(surname),
            email: e.str(email),
            password: e.str(passwordHash),
            username: e.str(username),
        });

        const newUser = await insert.run(clientDB);

        await createUserToken(newUser, req, res);

    }catch(err: unknown){
        return res.status(422).json({message: "Error inesperado."});
    }
}

export const SignIn = async (req: Request, res: Response) => {
    const {email, password, username} = req.body;

    if(!email && !username){
        return res.status(422).json({message: "Usuário ou email são obrigatórios"});
    }

    if(!password){
        return res.status(422).json({message: "A senha é obrigatória"});
    }
}