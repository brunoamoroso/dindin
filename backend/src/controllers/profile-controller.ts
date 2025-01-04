import { NextFunction, Request, Response } from "express";
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
    const {username, password} = req.body;

    if(!username){
        return res.status(422).json({message: "Usuário ou email são obrigatórios"});
    }

    if(!password){
        return res.status(422).json({message: "A senha é obrigatória"});
    }

    const queryUser = e.select(e.User, (userSelect) => {
        const isUsername = e.op(userSelect.username, "=", username);
        const isEmail = e.op(userSelect.email, "=", username);

        return{
            id: true,
            username: true,
            password: true,
            filter_single: e.op(isUsername, 'or', isEmail)
        }
    });
    
    const user = await queryUser.run(clientDB);

    if(!user){
        return res.status(422).json({message: "Usuário não existe"})
    }

    //check password
    const checkPassword = await bcrypt.compare(password, user.password);

    if(!checkPassword){
        return res.status(422).json({message: "Senha inválida"});
    }

    await createUserToken(user, req, res);
}

export const getAvatar = async (req: Request, res: Response) => {
    const user = req.user;

    if(!user){
        return res.status(401).json({message: "Usuário não autorizado"});
    }

    try{
        const queryAvatar = e.select(e.User, () => ({
            name: true,
            surname: true,
            photo: true,
            filter_single: {
                id: e.uuid(user)
            }
        }));

        const avatar = await queryAvatar.run(clientDB);

        return res.status(200).json(avatar);
    }catch(err){
        console.log(err);
    }
}