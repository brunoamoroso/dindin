import { Request, Response } from "express";
import clientDB from "../db/conn";

export const CreateProfile = async (req: Request, res: Response) => {
    const {photo, name, surname, email, password} = req.body;

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
        }).then((response) => {
            res.status(201).send({message: 'user created'});
        }).catch((err) => {
            throw new Error(err);
        });
}