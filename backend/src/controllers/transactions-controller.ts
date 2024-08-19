import { Request, Response } from "express";
import clientDB from "../db/conn";
import { LocalDate } from "edgedb";
import e from '../db/dbschema/edgeql-js';

export const addTransaction = async (req: Request, res: Response) => {
    console.log(req.body);
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

            res.status(201).json({message: "Transaction created"});
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
            return res.status(201).json({message: "Transaction Created"});
        }
    }catch(err){
        res.status(422).json({message: "Couldn't create the transaction"})
        throw new Error(err as string);
    }
}

export const getAllTransactionByMonth = async (req: Request, res: Response) => {
    const {selectedDate} = req.body;
    const startDate = new Date(selectedDate);
    const endMonthDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

    console.log(selectedDate);
    console.log(startDate);
    console.log(endMonthDate);

    try{
        const queryAllGainTransactionsByMonth = e.select(e.Gain, (gain) => {
    
            const filterCreatedByUser = e.op(gain.created_by.id, "=", e.uuid(req.user as string));
            const filterByDate = e.op(
                e.op(gain.date_earned, ">=", e.cal.local_datetime(startDate.toISOString())),
                "and",
                e.op(gain.date_earned, "<=", e.cal.local_datetime(endMonthDate.toISOString()))
            )

            return{
                description: true,
                amount: true,
                account: {
                    description: true,
                },
                category: {
                    desc: true
                },
                subCategory: {
                    desc: true
                },
                date_earned: true,
                amountGained: e.sum(gain.amount),
                filter: e.op(filterCreatedByUser, "and", filterByDate)
            }
        });
    
        const AllGainTransactionsByMonth = await queryAllGainTransactionsByMonth.run(clientDB);
        return res.status(200).json(AllGainTransactionsByMonth);
    }catch(err){
        throw new Error(err as string);
    }
}