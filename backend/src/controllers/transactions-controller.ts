import { Request, Response } from "express";
import clientDB from "../db/conn";
import { LocalDate } from "edgedb";
import e from '../db/dbschema/edgeql-js';

export const addTransaction = async (req: Request, res: Response) => {
    const {type, amount, desc, category, subCategory, account, recurrency, date, paymentMethod, paymentCondition} = req.body;
    const datePart = date.value.split("T");
    const [year, month, day] = datePart[0].split("-").map(Number);
    const localDate = new LocalDate(year, month, day);
    let installments = parseInt(req.body.installments);

    try{
        if(type === "gain"){
            const queryGainTransaction = e.insert(e.Gain, {
                description: e.str(desc),
                amount: e.int32(amount),
                category: e.cast(e.Category, e.uuid(category.id)),
                subCategory: e.cast(e.subCategory, e.uuid(subCategory.id)),
                account: e.cast(e.Account, e.uuid(account.id)),
                recurrency: e.cast(e.Recurrency, recurrency.id),
                date_earned: e.cal.local_date(localDate),
                created_by: e.cast(e.User, e.uuid(req.user as string))
            });

            const gainTransaction = await queryGainTransaction.run(clientDB);
            res.status(201).json(gainTransaction);
            return;
        }

        if(type === "expense"){
            if(paymentMethod === undefined){
                return res.status(422).json({message: "Payment Method is mandatory"});
            }

            if(paymentCondition === undefined){
                return res.status(422).json({message: "Payment Condition is mandatory"});
            }

            if(paymentMethod === "credit" && paymentCondition === "single"){
                installments = 1;
            }

            const queryExpenseTransaction = e.insert(e.Expense, {
                description: e.str(desc),
                amount: e.int32(amount),
                category: e.cast(e.Category, e.uuid(category.id)),
                subCategory: e.cast(e.subCategory, e.uuid(subCategory.id)),
                account: e.cast(e.Account, e.uuid(account.id)),
                recurrency: e.cast(e.Recurrency, recurrency.id),
                date_paid: e.cal.local_date(localDate),
                created_by: e.cast(e.User, e.uuid(req.user as string)),
                payment_condition: e.str(paymentCondition),
                payment_method: e.str(paymentMethod),
                installments: e.int16(installments)
            });

            const expenseTransaction = await queryExpenseTransaction.run(clientDB);
            return res.status(201).json(expenseTransaction);
        }

    // if(type === "expense"){        
    //     try{
    //         await clientDB.execute(`
    //                 insert Expense {
    //                     description := <str>$desc,
    //                     amount := <int32>$amount,
    //                     category := (select Category filter .id = <uuid>$category),
    //                     subCategory := (select subCategory filter .id = <uuid>$subCategory),
    //                     account := (select Account filter .id = <uuid>$account),
    //                     date_paid := <cal::local_date>$date,
    //                     recurrency := <default::Recurrency>$recurrency,
    //                     created_by := (select User filter .id = <uuid>$created_by),
    //                     payment_method := <str>$paymentMethod,
    //                     payment_condition := <str>$paymentCondition,
    //                     installments := <int16>$installments
    //                 }
    //             `, {
    //                 desc: desc,
    //                 amount: amount,
    //                 category: category.id,
    //                 subCategory: subCategory.id,
    //                 account: account.id,
    //                 date: localDate,
    //                 recurrency: recurrency.id,
    //                 created_by: 'd9f7e7e2-42f8-11ef-8903-0b2c32e274a0',
    //                 paymentMethod: paymentMethod,
    //                 paymentCondition: paymentCondition,
    //                 installments: parseInt(installments)
    //             });
                
    //     }catch(err){
    //         throw new Error(err as string);
    //     }
    }catch(err){
        res.status(422).json({message: "Couldn't create the transaction"})
        throw new Error(err as string);
    }
}