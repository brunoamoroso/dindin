import { Request, Response } from "express";
import e from "../db/dbschema/edgeql-js";
import clientDB from "../db/conn";

export const getUserSelectedCoins = async (req: Request, res: Response) => {
    const user = req.user;

    try {
        const userCoins = await e.select(e.Coin, (c) => ({
            img: true,
            desc: true,
            code: true,
            filter: e.op(c["<selectedCoins[is User]"].id, "=", e.uuid(user)),
        })).run(clientDB);

        res.status(200).json(userCoins);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}