import { Request, Response } from "express";
import clientDB from "../db/conn";
import { LocalDate } from "edgedb";

export const addTransaction = async (req: Request, res: Response) => {
    const {type, amount, desc, category, subCategory, account, recurrency, date, paymentMethod, paymentCondition, installments} = req.body;
    const datePart = date.value.split("T");
    const [year, month, day] = datePart[0].split("-").map(Number);
    const localDate = new LocalDate(year, month, day);

    if(type === "gain"){        
        try{
            await clientDB.execute(`
                    insert Gain {
                        description := <str>$desc,
                        amount := <int32>$amount,
                        category := (select Category filter .id = <uuid>$category),
                        subCategory := (select subCategory filter .id = <uuid>$subCategory),
                        account := (select Account filter .id = <uuid>$account),
                        date_earned := <cal::local_date>$date,
                        recurrency := <default::Recurrency>$recurrency,
                        created_by := (select User filter .id = <uuid>$created_by)
                    }
                `, {
                    desc: desc,
                    amount: amount,
                    category: category.id,
                    subCategory: subCategory.id,
                    account: account.id,
                    date: localDate,
                    recurrency: recurrency.id,
                    created_by: 'd9f7e7e2-42f8-11ef-8903-0b2c32e274a0'
                });
        }catch(err){
            throw new Error(err as string);
        }
    }

    if(type === "expense"){        
        try{
            await clientDB.execute(`
                    insert Expense {
                        description := <str>$desc,
                        amount := <int32>$amount,
                        category := (select Category filter .id = <uuid>$category),
                        subCategory := (select subCategory filter .id = <uuid>$subCategory),
                        account := (select Account filter .id = <uuid>$account),
                        date_paid := <cal::local_date>$date,
                        recurrency := <default::Recurrency>$recurrency,
                        created_by := (select User filter .id = <uuid>$created_by),
                        payment_method := <str>$paymentMethod,
                        payment_condition := <str>$paymentCondition,
                        installments := <int16>$installments
                    }
                `, {
                    desc: desc,
                    amount: amount,
                    category: category.id,
                    subCategory: subCategory.id,
                    account: account.id,
                    date: localDate,
                    recurrency: recurrency.id,
                    created_by: 'd9f7e7e2-42f8-11ef-8903-0b2c32e274a0',
                    paymentMethod: paymentMethod,
                    paymentCondition: paymentCondition,
                    installments: parseInt(installments)
                });
                
        }catch(err){
            throw new Error(err as string);
        }
    }

    return res.status(201).json({message: "Transactron created"});
}